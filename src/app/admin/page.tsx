import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, AdminStatCard } from "@/components/admin/admin-ui";
import {
  Badge,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime, formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin overview",
};

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [
    memberCount,
    adminCount,
    publishedWorkshops,
    draftWorkshops,
    paidPurchases,
    revenue,
    recentPurchases,
    upcomingWorkshops,
    unannouncedCount,
    notificationCount,
  ] = await Promise.all([
    db.user.count({ where: { role: "USER" } }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.workshop.count({ where: { published: true } }),
    db.workshop.count({ where: { published: false } }),
    db.workshopPurchase.count({ where: { status: "PAID" } }),
    db.workshopPurchase.aggregate({
      where: { status: "PAID" },
      _sum: { amountCents: true },
    }),
    db.workshopPurchase.findMany({
      where: { status: "PAID" },
      orderBy: { paidAt: "desc" },
      take: 6,
      select: {
        id: true,
        amountCents: true,
        currency: true,
        paidAt: true,
        user: { select: { name: true, email: true } },
        workshop: { select: { title: true, slug: true } },
      },
    }),
    db.workshop.findMany({
      where: { startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        startsAt: true,
        type: true,
        published: true,
        _count: { select: { purchases: { where: { status: "PAID" } } } },
      },
    }),
    db.workshop.count({
      where: {
        published: true,
        type: "PUBLIC",
        notificationSentAt: null,
      },
    }),
    db.notification.count(),
  ]);

  const stats = [
    {
      label: "Members",
      value: memberCount.toString(),
      accent: "bg-violet-300",
    },
    {
      label: "Published workshops",
      value: publishedWorkshops.toString(),
      accent: "bg-sky-300",
    },
    {
      label: "Paid enrollments",
      value: paidPurchases.toString(),
      accent: "bg-emerald-300",
    },
    {
      label: "Gross revenue",
      value: formatMoney(revenue._sum.amountCents ?? 0, "usd"),
      accent: "bg-amber-300",
    },
  ];

  const controls = [
    {
      href: "/admin/workshops",
      title: "Workshops",
      description: "Create, edit, publish, and retire sessions.",
      meta: `${publishedWorkshops} live · ${draftWorkshops} draft${draftWorkshops === 1 ? "" : "s"}`,
      accent: "bg-sky-400/10 text-sky-200 ring-sky-300/20",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 5.25h15A.75.75 0 0 1 20.25 6v13.5a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75Z"
        />
      ),
    },
    {
      href: "/admin/members",
      title: "Members",
      description: "Review your audience and manage admin access.",
      meta: `${memberCount} member${memberCount === 1 ? "" : "s"} · ${adminCount} admin${adminCount === 1 ? "" : "s"}`,
      accent: "bg-violet-400/10 text-violet-200 ring-violet-300/20",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      ),
    },
    {
      href: "/admin/enrollments",
      title: "Enrollments",
      description: "Inspect paid and pending workshop access.",
      meta: `${paidPurchases} paid enrollment${paidPurchases === 1 ? "" : "s"}`,
      accent: "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
        />
      ),
    },
    {
      href: "/admin/notifications",
      title: "Announcements",
      description: "Send updates to every member of the site.",
      meta: `${notificationCount} announcement${notificationCount === 1 ? "" : "s"} sent`,
      accent: "bg-amber-400/10 text-amber-200 ring-amber-300/20",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.084 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Control room"
        title="Admin overview"
        description="Everything that shapes the public site and member experience, in one place."
        actions={
          <>
            <Link href="/admin/workshops/new" className={primaryButton}>
              New workshop
            </Link>
            <Link href="/admin/notifications" className={secondaryButton}>
              Send announcement
            </Link>
          </>
        }
      />

      {unannouncedCount > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-amber-300/15 bg-amber-400/[0.06] px-5 py-4">
          <div>
            <p className="text-sm font-medium text-amber-100">
              {unannouncedCount} public workshop
              {unannouncedCount === 1 ? " is" : "s are"} live without an
              announcement.
            </p>
            <p className="mt-0.5 text-sm text-amber-100/50">
              Publish a notice so members know the session is available.
            </p>
          </div>
          <Link
            href="/admin/notifications"
            className="text-sm font-medium text-amber-200 underline decoration-amber-300/30 underline-offset-4 hover:text-white"
          >
            Send an update
          </Link>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            accent={stat.accent}
            delay={index * 55}
          />
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Content control
            </h2>
            <p className="mt-1 text-sm text-white/35">
              Jump straight into the part of the site you want to shape.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {controls.map((control, index) => (
            <Link
              key={control.href}
              href={control.href}
              className={`${panelClass} card-interactive animate-enter group flex items-start gap-4 p-5 hover:border-white/20 hover:shadow-md`}
              style={{ animationDelay: `${120 + index * 45}ms` }}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ${control.accent}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="size-5"
                  aria-hidden="true"
                >
                  {control.icon}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-base font-semibold text-white">
                  {control.title}
                  <span
                    className="text-white/20 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-violet-300"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-6 text-white/35">
                  {control.description}
                </span>
                <span className="mt-2 block text-xs font-medium text-white/30">
                  {control.meta}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className={`${panelClass} animate-enter p-6`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white/80">
              Recent payments
            </h2>
            <Link
              href="/admin/enrollments"
              className="text-sm font-semibold text-violet-200 hover:text-white"
            >
              All enrollments
            </Link>
          </div>

          {recentPurchases.length > 0 ? (
            <div className="mt-4 divide-y divide-white/[0.07]">
              {recentPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="-mx-2 flex flex-col gap-1.5 rounded-lg px-2 py-3 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/80">
                      {purchase.user.name}
                    </p>
                    <p className="truncate text-xs text-white/30">
                      {purchase.workshop.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:block sm:shrink-0 sm:text-right">
                    <p className="text-sm font-semibold text-white/80">
                      {formatMoney(purchase.amountCents, purchase.currency)}
                    </p>
                    <p className="text-xs text-white/30">
                      {purchase.paidAt ? formatDateTime(purchase.paidAt) : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/30">
              No paid enrollments yet.
            </p>
          )}
        </section>

        <section
          className={`${panelClass} animate-enter p-6`}
          style={{ animationDelay: "90ms" }}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white/80">
              Upcoming workshops
            </h2>
            <Link
              href="/admin/workshops"
              className="text-sm font-semibold text-violet-200 hover:text-white"
            >
              Manage
            </Link>
          </div>
          {upcomingWorkshops.length > 0 ? (
            <div className="mt-4 divide-y divide-white/[0.07]">
              {upcomingWorkshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="-mx-2 flex flex-col gap-1.5 rounded-lg px-2 py-3 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/workshops/${workshop.slug}`}
                      className="block truncate text-sm font-medium text-white/80 hover:text-white"
                    >
                      {workshop.title}
                    </Link>
                    <p className="text-xs text-white/30">
                      {formatDateTime(workshop.startsAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <Badge tone={workshop.type === "PRIVATE" ? "amber" : "green"}>
                      {workshop.type === "PRIVATE" ? "Paid" : "Public"}
                    </Badge>
                    {!workshop.published ? <Badge tone="red">Draft</Badge> : null}
                    <span className="text-xs text-white/30">
                      {workshop._count.purchases} paid
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/30">
              No upcoming workshops scheduled.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
