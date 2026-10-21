import type { Metadata } from "next";
import Link from "next/link";
import { markNotificationsReadAction } from "@/actions/notifications";
import { SubmitButton } from "@/components/submit-button";
import {
  Badge,
  EmptyState,
  eyebrowClass,
  Notice,
  panelClass,
  primaryButton,
  secondaryButton,
  sectionTitleClass,
  subtleButton,
} from "@/components/ui";
import { canAccessJoinLink } from "@/lib/access";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime, formatMoney } from "@/lib/format";
import { getNotificationsForUser } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const user = await requireUser("/dashboard");
  const query = await searchParams;
  const error = Array.isArray(query.error) ? query.error[0] : query.error;

  const [purchases, notifications] = await Promise.all([
    db.workshopPurchase.findMany({
      where: {
        userId: user.id,
        status: { in: ["PAID", "PENDING"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        amountCents: true,
        currency: true,
        workshop: {
          select: {
            id: true,
            slug: true,
            title: true,
            summary: true,
            type: true,
            published: true,
            startsAt: true,
            location: true,
            meetingUrl: true,
          },
        },
      },
    }),
    getNotificationsForUser(user.id, user.createdAt),
  ]);

  const paidCount = purchases.filter((purchase) => purchase.status === "PAID").length;
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className={eyebrowClass}>Your workspace</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
            Hi, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/40 sm:text-base sm:leading-7">
            Access your paid sessions, review notifications, and keep your
            workshop links in one place.
          </p>
        </div>
        <Link href="/" className={secondaryButton}>
          Browse workshops
        </Link>
      </div>

      {error === "forbidden" ? (
        <div className="mt-7">
          <Notice tone="error">
            You do not have permission to open the admin panel.
          </Notice>
        </div>
      ) : null}

      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        <div
          className={`${panelClass} card-interactive animate-enter relative overflow-hidden p-5 sm:p-6`}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-emerald-400/[0.08] blur-2xl"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between gap-3">
            <p className={eyebrowClass}>Paid workshops</p>
            <span className="size-1.5 rounded-full bg-emerald-300" />
          </div>
          <p className="mt-5 text-4xl font-semibold tabular-nums tracking-[-0.06em] text-white">
            {paidCount.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs text-white/30">Lifetime workshop access</p>
        </div>
        <div
          className={`${panelClass} card-interactive animate-enter relative overflow-hidden p-5 sm:p-6`}
          style={{ animationDelay: "70ms" }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-violet-400/[0.09] blur-2xl"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between gap-3">
            <p className={eyebrowClass}>Unread updates</p>
            <span className="size-1.5 rounded-full bg-violet-300" />
          </div>
          <p className="mt-5 text-4xl font-semibold tabular-nums tracking-[-0.06em] text-white">
            {unreadCount.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs text-white/30">Notifications waiting for you</p>
        </div>
        <div
          className={`${panelClass} card-interactive animate-enter relative overflow-hidden p-5 sm:p-6`}
          style={{ animationDelay: "140ms" }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-white/[0.04] blur-2xl"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between gap-3">
            <p className={eyebrowClass}>Account</p>
            <Badge tone={user.role === "ADMIN" ? "amber" : "slate"}>
              {user.role === "ADMIN" ? "Admin" : "Member"}
            </Badge>
          </div>
          <p className="mt-5 truncate text-lg font-medium tracking-[-0.025em] text-white">
            {user.email}
          </p>
          <Link
            href="/account"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-violet-200 hover:text-white"
          >
            Manage account
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <p className={eyebrowClass}>Your access</p>
            <h2 className={`${sectionTitleClass} mt-2`}>Your workshops</h2>
            <p className="mt-2 text-sm text-white/35">
              Paid sessions appear here with their access state.
            </p>
          </div>
          <span className="text-xs text-white/25">
            {purchases.length} {purchases.length === 1 ? "workshop" : "workshops"}
          </span>
        </div>

        {purchases.length > 0 ? (
          <div className="mt-5 space-y-3">
            {purchases.map((purchase) => {
              const workshop = purchase.workshop;
              const paid = purchase.status === "PAID";
              const canAccess = canAccessJoinLink(workshop, user, paid);

              return (
                <article
                  key={purchase.id}
                  className={`${panelClass} card-interactive flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={paid ? "green" : "amber"}>
                        {paid ? "Paid" : "Payment pending"}
                      </Badge>
                      <Badge tone="slate">
                        {formatMoney(purchase.amountCents, purchase.currency)}
                      </Badge>
                    </div>
                    <h3 className="mt-3 truncate text-lg font-medium tracking-[-0.025em] text-white">
                      <Link
                        href={`/workshops/${workshop.slug}`}
                        className="hover:text-violet-200"
                      >
                        {workshop.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-xs text-white/30">
                      {formatDateTime(workshop.startsAt)} &middot;{" "}
                      {workshop.location || "Online"}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      href={`/workshops/${workshop.slug}`}
                      className={subtleButton}
                    >
                      Details
                    </Link>
                    {canAccess ? (
                      <a
                        href={workshop.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={primaryButton}
                      >
                        Open link
                      </a>
                    ) : (
                      <Link
                        href={`/workshops/${workshop.slug}`}
                        className={primaryButton}
                      >
                        Complete payment
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="No workshop access yet"
              description="Public workshops are free to join. Paid workshops appear here once you purchase access."
              action={
                <Link href="/" className={primaryButton}>
                  Explore workshops
                </Link>
              }
            />
          </div>
        )}
      </section>

      <section id="notifications" className="mt-16 scroll-mt-32">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.08] pb-5">
          <div>
            <p className={eyebrowClass}>In-app updates</p>
            <h2 className={`${sectionTitleClass} mt-2`}>Notifications</h2>
            <p className="mt-2 text-sm text-white/35">
              Public workshop announcements and organizer updates.
            </p>
          </div>
          {unreadCount > 0 ? (
            <form action={markNotificationsReadAction}>
              <SubmitButton className={secondaryButton} pendingLabel="Marking...">
                Mark all as read
              </SubmitButton>
            </form>
          ) : null}
        </div>

        {notifications.length > 0 ? (
          <div className={`${panelClass} mt-5 divide-y divide-white/[0.07] overflow-hidden`}>
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`flex gap-4 p-5 transition-colors sm:p-6 ${
                  notification.unread
                    ? "bg-violet-400/[0.045] hover:bg-violet-400/[0.06]"
                    : "hover:bg-white/[0.025]"
                }`}
              >
                <span
                  className={`mt-2 size-1.5 shrink-0 rounded-full ${
                    notification.unread
                      ? "bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.7)]"
                      : "bg-white/20"
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-white">
                      {notification.title}
                    </h3>
                    {notification.unread ? <Badge tone="indigo">New</Badge> : null}
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/40">
                    {notification.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/25">
                    <span>{formatDateTime(notification.createdAt)}</span>
                    {notification.workshop ? (
                      <Link
                        href={`/workshops/${notification.workshop.slug}`}
                        className="font-medium text-violet-200 hover:text-white"
                      >
                        View workshop
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="You are all caught up"
              description="Notifications about new public workshops and organizer updates will appear here."
            />
          </div>
        )}
      </section>
    </div>
  );
}
