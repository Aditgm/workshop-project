import { createHash } from "node:crypto";
import { db } from "@/lib/db";

export type RateLimitRule = {
  scope: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

function hashIdentifier(scope: string, identifier: string): string {
  return `${scope}:${createHash("sha256").update(identifier).digest("hex")}`;
}

export async function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowSeconds,
}: RateLimitRule): Promise<RateLimitResult> {
  const key = hashIdentifier(scope, identifier);
  const windowMs = windowSeconds * 1000;
  const now = Date.now();
  const windowStart = new Date(now - windowMs);

  const [attempts, oldest] = await Promise.all([
    db.rateLimitAttempt.count({
      where: { key, createdAt: { gte: windowStart } },
    }),
    db.rateLimitAttempt.findFirst({
      where: { key, createdAt: { gte: windowStart } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    }),
  ]);

  if (attempts >= limit) {
    const retryAfterSeconds = oldest
      ? Math.max(
          1,
          Math.ceil((oldest.createdAt.getTime() + windowMs - now) / 1000),
        )
      : windowSeconds;

    return { allowed: false, retryAfterSeconds };
  }

  await db.rateLimitAttempt.create({ data: { key } });

  if (Math.random() < 0.02) {
    await db.rateLimitAttempt.deleteMany({
      where: { createdAt: { lt: new Date(now - 24 * 60 * 60 * 1000) } },
    });
  }

  return { allowed: true };
}

export async function clearRateLimit(
  scope: string,
  identifier: string,
): Promise<void> {
  await db.rateLimitAttempt.deleteMany({
    where: { key: hashIdentifier(scope, identifier) },
  });
}

export function rateLimitMessage(result: RateLimitResult): string {
  if (result.allowed) return "";

  const minutes = Math.max(1, Math.ceil(result.retryAfterSeconds / 60));
  return `Too many attempts. Try again in ${minutes} ${
    minutes === 1 ? "minute" : "minutes"
  }.`;
}
