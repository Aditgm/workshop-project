"use server";

import { hash, compare } from "bcryptjs";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { createSession, destroySession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  clearRateLimit,
  consumeRateLimit,
  rateLimitMessage,
} from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import {
  firstIssue,
  getString,
  loginSchema,
} from "@/lib/validation";

let dummyHashPromise: Promise<string> | null = null;

function getDummyHash(): Promise<string> {
  dummyHashPromise ??= hash("timing-placeholder-password", 12);
  return dummyHashPromise;
}

export async function loginAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ipLimit = await consumeRateLimit({
    scope: "login-ip",
    identifier: await getClientIp(),
    limit: 40,
    windowSeconds: 15 * 60,
  });

  if (!ipLimit.allowed) {
    return { error: rateLimitMessage(ipLimit) };
  }

  const parsed = loginSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const emailLimit = await consumeRateLimit({
    scope: "login-email",
    identifier: parsed.data.email,
    limit: 8,
    windowSeconds: 15 * 60,
  });

  if (!emailLimit.allowed) {
    return { error: rateLimitMessage(emailLimit) };
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, passwordHash: true, role: true },
  });

  const valid = await compare(
    parsed.data.password,
    user?.passwordHash ?? (await getDummyHash()),
  );

  if (!user || !valid) {
    return { error: "Invalid email or password." };
  }

  if (user.role !== "ADMIN") {
    return {
      error: "This account does not have administrator access.",
    };
  }

  await clearRateLimit("login-email", parsed.data.email);
  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
