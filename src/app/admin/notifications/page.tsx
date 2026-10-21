import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DeleteNotificationForm } from "@/components/admin/delete-notification-form";
import { NotificationForm } from "@/components/admin/notification-form";
import {
  Badge,
  EmptyState,
  Notice,
  panelClass,
  primaryButton,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Notifications",
};

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    notice?: string | string[];
    error?: string | string[];
  }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const notice = first(params.notice);
  const error = first(params.error);

  const [notifications, workshops, memberCount] = await Promise.all([
    db.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
        workshop: { select: { title: true, slug: true } },
        _count: { select: { reads: true } },
      },
    }),
    db.workshop.findMany({
      orderBy: { startsAt: "desc" },
      select: { id: true, title: true },
    }),
    db.user.count({ where: { role: "USER" } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Member communication"
        title="Announcements"
        description="Send in-app updates to every member. Publishing a public workshop also sends its first announcement automatically."
        actions={
          <a href="#compose" className={primaryButton}>
            Write announcement
          </a>
        }
      />

      {notice ? (
        <div className="mt-6">
          <Notice tone="success">{notice}</Notice>
        </div>
      ) : null}
      {error ? (
        <div className="mt-6">
          <Notice tone="error">{error}</Notice>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <section id="compose" className={`${panelClass} scroll-mt-24 p-6`}>
          <h2 className="text-base font-semibold text-white">
            New announcement
          </h2>
          <p className="mt-1 text-sm text-white/30">
            Delivered in-app to {memberCount} member{memberCount === 1 ? "" : "s"}.
          </p>
          <div className="mt-5">
            <NotificationForm workshops={workshops} />
          </div>
        </section>

        <section className={`${panelClass} overflow-hidden`}>
          <div className="border-b border-white/[0.07] px-6 py-5">
            <h2 className="text-base font-semibold text-white">
              Recent notifications
            </h2>
            <p className="mt-1 text-sm text-white/30">
              Read counts update as members open their dashboard. Up to 50
              announcements are shown.
            </p>
          </div>

          {notifications.length > 0 ? (
            <div className="divide-y divide-white/[0.07]">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className="px-6 py-4 transition-colors hover:bg-white/[0.025]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 text-sm font-semibold text-white">
                      {notification.title}
                    </h3>
                    <DeleteNotificationForm
                      id={notification.id}
                      title={notification.title}
                    />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge tone="indigo">
                      {notification._count.reads} read
                    </Badge>
                    <span className="text-xs text-white/30">
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/40">
                    {notification.message}
                  </p>
                  {notification.workshop ? (
                    <Link
                      href={`/workshops/${notification.workshop.slug}`}
                      className="mt-2 inline-block text-xs font-semibold text-violet-200 hover:text-white"
                    >
                      {notification.workshop.title}
                    </Link>
                  ) : (
                    <p className="mt-2 text-xs text-white/25">
                      General announcement
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No announcements yet"
                description="Write the first update for your members. It will appear on every dashboard."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
