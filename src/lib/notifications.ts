import { db } from "@/lib/db";

export async function notifyPublicWorkshopIfNeeded(workshopId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const workshop = await tx.workshop.findUnique({
      where: { id: workshopId },
      select: {
        id: true,
        title: true,
        summary: true,
        published: true,
        type: true,
        notificationSentAt: true,
      },
    });

    if (
      !workshop ||
      !workshop.published ||
      workshop.type !== "PUBLIC" ||
      workshop.notificationSentAt
    ) {
      return;
    }

    const claimed = await tx.workshop.updateMany({
      where: {
        id: workshop.id,
        published: true,
        type: "PUBLIC",
        notificationSentAt: null,
      },
      data: { notificationSentAt: new Date() },
    });

    if (claimed.count === 0) return;

    await tx.notification.create({
      data: {
        title: `New public workshop: ${workshop.title}`,
        message: workshop.summary,
        workshopId: workshop.id,
      },
    });
  });
}

export async function getUnreadNotificationCount(
  userId: string,
  since: Date,
): Promise<number> {
  return db.notification.count({
    where: {
      createdAt: { gte: since },
      reads: { none: { userId } },
    },
  });
}

export async function getNotificationsForUser(userId: string, since: Date) {
  const notifications = await db.notification.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      message: true,
      createdAt: true,
      workshop: { select: { slug: true, title: true } },
      reads: { where: { userId }, select: { id: true } },
    },
  });

  return notifications.map(({ reads, ...notification }) => ({
    ...notification,
    unread: reads.length === 0,
  }));
}

export async function markNotificationsRead(userId: string): Promise<void> {
  const unread = await db.notification.findMany({
    where: { reads: { none: { userId } } },
    select: { id: true },
  });

  if (unread.length === 0) return;

  await db.notificationRead.createMany({
    data: unread.map((notification) => ({
      notificationId: notification.id,
      userId,
    })),
  });
}
