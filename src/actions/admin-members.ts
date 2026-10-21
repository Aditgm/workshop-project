"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { roleChangeError } from "@/lib/admin";
import { db } from "@/lib/db";
import { getString } from "@/lib/validation";

const ROLES = new Set(["USER", "ADMIN"]);

function membersUrl(message: { notice?: string; error?: string }): string {
  const params = new URLSearchParams();
  if (message.notice) params.set("notice", message.notice);
  if (message.error) params.set("error", message.error);
  const query = params.toString();
  return query ? `/admin/members?${query}` : "/admin/members";
}

export async function updateMemberRoleAction(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const targetId = getString(formData, "userId");
  const nextRole = getString(formData, "role");

  if (!targetId || !ROLES.has(nextRole)) {
    redirect(membersUrl({ error: "That role update is not valid." }));
  }

  const target = await db.user.findUnique({
    where: { id: targetId },
    select: { id: true, name: true, role: true },
  });

  if (!target) {
    redirect(membersUrl({ error: "Member not found." }));
  }

  const adminCount = await db.user.count({ where: { role: "ADMIN" } });
  const error = roleChangeError({
    actorId: actor.id,
    targetId: target.id,
    targetRole: target.role,
    nextRole,
    adminCount,
  });

  if (error) {
    redirect(membersUrl({ error }));
  }

  if (target.role === nextRole) {
    redirect(
      membersUrl({
        notice:
          nextRole === "ADMIN"
            ? `${target.name} is already an administrator.`
            : `${target.name} is already a member.`,
      }),
    );
  }

  await db.user.update({
    where: { id: target.id },
    data: { role: nextRole },
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  redirect(
    membersUrl({
      notice:
        nextRole === "ADMIN"
          ? `${target.name} can now manage the site.`
          : `${target.name}'s administrator access was removed.`,
    }),
  );
}
