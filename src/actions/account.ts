"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { requireUser, revokeOtherSessions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  clearRateLimit,
  consumeRateLimit,
  rateLimitMessage,
} from "@/lib/rate-limit";
import {
  changePasswordSchema,
  firstIssue,
  getString,
} from "@/lib/validation";

export async function changePasswordAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser("/account");

  const limit = await consumeRateLimit({
    scope: "password-change",
    identifier: user.id,
    limit: 5,
    windowSeconds: 15 * 60,
  });

  if (!limit.allowed) {
    return { error: rateLimitMessage(limit) };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: getString(formData, "currentPassword"),
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const account = await db.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  if (!account) {
    return { error: "Account not found. Sign in again." };
  }

  const valid = await compare(
    parsed.data.currentPassword,
    account.passwordHash,
  );

  if (!valid) {
    return { error: "Current password is incorrect." };
  }

  if (parsed.data.currentPassword === parsed.data.password) {
    return { error: "Choose a password different from your current one." };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await revokeOtherSessions(user.id);
  await clearRateLimit("password-change", user.id);
  redirect("/account?updated=1");
}
