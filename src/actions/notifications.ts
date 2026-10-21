"use server";

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { requireAdmin, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  markNotificationsRead,
} from "@/lib/notifications";
import {
  firstIssue,
  getString,
  notificationSchema,
} from "@/lib/validation";

export async function markNotificationsReadAction(): Promise<void> {
  const user = await requireUser();
  await markNotificationsRead(user.id);
  refresh();
}

export async function sendNotificationAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = notificationSchema.safeParse({
    title: getString(formData, "title"),
    message: getString(formData, "message"),
    workshopId: getString(formData, "workshopId"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  let workshopId: string | null = parsed.data.workshopId || null;

  if (workshopId) {
    const workshop = await db.workshop.findUnique({
      where: { id: workshopId },
      select: { id: true },
    });
    if (!workshop) {
      workshopId = null;
    }
  }

  await db.notification.create({
    data: {
      title: parsed.data.title,
      message: parsed.data.message,
      workshopId,
    },
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
  refresh();

  return { success: "Notification sent to all members." };
}

export async function deleteNotificationAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/notifications?error=Announcement+not+found.");
  }

  const notification = await db.notification.findUnique({
    where: { id },
    select: { id: true, title: true },
  });

  if (!notification) {
    redirect("/admin/notifications?error=Announcement+not+found.");
  }

  await db.notification.delete({ where: { id: notification.id } });

  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
  redirect(
    `/admin/notifications?notice=${encodeURIComponent(
      `${notification.title} was deleted.`,
    )}`,
  );
}
