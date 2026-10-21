import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { AdminPageHeader, AdminStatCard } from "@/components/admin/admin-ui";
import {
  Badge,
  EmptyState,
  inputClass,
  primaryButton,
  secondaryButton,
  subtleButton,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime, formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Enrollments",
};

const STATUSES = ["PAID", "PENDING", "CANCELLED", "REFUNDED"] as const;

type EnrollmentStatus = (typeof STATUSES)[number] | "OTHER";

const statusTone: Record<
  EnrollmentStatus,
  "green" | "amber" | "red" | "slate"
> = {
  PAID: "green",
  PENDING: "amber",
  CANCELLED: "slate",
  REFUNDED: "red",
  OTHER: "slate",
};

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function normalizeStatus(value: string): EnrollmentStatus {
  return STATUSES.includes(value as (typeof STATUSES)[number])
    ? (value as (typeof STATUSES)[number])
    : "OTHER";
}

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
  }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const q = first(params.q).slice(0, 100);
  const statusFilter = first(params.status);

  const where: Prisma.WorkshopPurchaseWhereInput = {};

  if (q) {
    where.OR = [
      { user: { is: { name: { contains: q } } } },
      { user: { is: { email: { contains: q } } } },
      { workshop: { is: { title: { contains: q } } } },
    ];
  }

  if (STATUSES.includes(statusFilter as (typeof STATUSES)[number])) {
    where.status = statusFilter;
  }

  const [purchases, matchingCount, paidCount, pendingCount, revenue] =
    await Promise.all([
      db.workshopPurchase.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          status: true,
          amountCents: true,
          currency: true,
          createdAt: true,
          paidAt: true,
          user: { select: { name: true, email: true } },
          workshop: { select: { title: true, slug: true, type: true } },
        },
      }),
      db.workshopPurchase.count({ where }),
      db.workshopPurchase.count({ where: { status: "PAID" } }),
      db.workshopPurchase.count({ where: { status: "PENDING" } }),
      db.workshopPurchase.aggregate({
        where: { status: "PAID" },
        _sum: { amountCents: true },
      }),
    ]);

  const hasFilters = Boolean(q || statusFilter);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Access"
        title="Enrollments"
        description="Track every workshop purchase, including pending checkout sessions and refunded access."
        actions={
          <Link href="/admin/workshops" className={primaryButton}>
            Manage workshops
          </Link>
        }
      />

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <AdminStatCard
          label="Paid enrollments"
          value={paidCount.toString()}
          accent="bg-emerald-300"
        />
        <AdminStatCard
          label="Pending checkout"
          value={pendingCount.toString()}
          accent="bg-amber-300"
          delay={55}
        />
        <AdminStatCard
          label="Gross revenue"
          value={formatMoney(revenue._sum.amountCents ?? 0, "usd")}
          accent="bg-violet-300"
          delay={110}
        />
      </div>

      <form
        method="get"
        className="mt-6 flex flex-col gap-2 rounded-[22px] border border-white/10 bg-[#070708]/85 p-3 shadow-sm sm:flex-row sm:items-center"
      >
        <label htmlFor="enrollment-search" className="sr-only">
          Search enrollments
        </label>
        <input
          id="enrollment-search"
          name="q"
          defaultValue={q}
          className={`${inputClass} sm:max-w-xs`}
          placeholder="Search member or workshop"
        />
        <label htmlFor="enrollment-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="enrollment-status"
          name="status"
          defaultValue={statusFilter}
          className={`${inputClass} sm:max-w-44`}
        >
          <option value="">All statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <button type="submit" className={secondaryButton}>
          Apply filters
        </button>
        {hasFilters ? (
          <Link href="/admin/enrollments" className={subtleButton}>
            Clear
          </Link>
        ) : null}
      </form>

      <div className="mt-4 overflow-hidden rounded-[25px] border border-white/10 bg-[#070708]/85 shadow-sm">
        {purchases.length > 0 ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-3 text-xs text-white/30">
              <span>
                Showing {purchases.length} of {matchingCount} result
                {matchingCount === 1 ? "" : "s"}
              </span>
              {matchingCount > 100 ? (
                <span>Refine the search to see more.</span>
              ) : null}
            </div>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wide text-white/30">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Member</th>
                    <th className="px-5 py-3 font-semibold">Workshop</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Started</th>
                    <th className="px-5 py-3 font-semibold">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {purchases.map((purchase) => {
                    const status = normalizeStatus(purchase.status);

                    return (
                      <tr
                        key={purchase.id}
                        className="transition-colors hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">
                            {purchase.user.name}
                          </p>
                          <p className="truncate text-xs text-white/30">
                            {purchase.user.email}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/workshops/${purchase.workshop.slug}`}
                            className="font-medium text-white hover:text-white"
                          >
                            {purchase.workshop.title}
                          </Link>
                          <p className="text-xs text-white/30">
                            {purchase.workshop.type === "PRIVATE"
                              ? "Paid workshop"
                              : "Public workshop"}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-medium text-white/60">
                          {formatMoney(
                            purchase.amountCents,
                            purchase.currency,
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Badge tone={statusTone[status]}>
                            {purchase.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-white/40">
                          {formatDateTime(purchase.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-white/40">
                          {purchase.paidAt
                            ? formatDateTime(purchase.paidAt)
                            : "Not paid"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-white/[0.07] xl:hidden">
              {purchases.map((purchase) => {
                const status = normalizeStatus(purchase.status);

                return (
                  <article key={purchase.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {purchase.user.name}
                        </p>
                        <p className="truncate text-xs text-white/30">
                          {purchase.user.email}
                        </p>
                      </div>
                      <Badge tone={statusTone[status]}>
                        {purchase.status}
                      </Badge>
                    </div>

                    <div className="mt-2">
                      <Link
                        href={`/workshops/${purchase.workshop.slug}`}
                        className="text-sm font-medium text-white hover:text-white"
                      >
                        {purchase.workshop.title}
                      </Link>
                      <p className="text-xs text-white/30">
                        {purchase.workshop.type === "PRIVATE"
                          ? "Paid workshop"
                          : "Public workshop"}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-white/[0.025] p-3 text-xs">
                      <div>
                        <p className="font-semibold text-white/30">Amount</p>
                        <p className="mt-0.5 font-medium text-white/70">
                          {formatMoney(
                            purchase.amountCents,
                            purchase.currency,
                          )}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold text-white/30">Started</p>
                        <p className="mt-0.5 text-white/60">
                          {formatDateTime(purchase.createdAt)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold text-white/30">Paid</p>
                        <p className="mt-0.5 text-white/60">
                          {purchase.paidAt
                            ? formatDateTime(purchase.paidAt)
                            : "Not paid"}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No enrollments found"
              description="Paid and pending workshop checkouts will appear here. Try clearing the current filters."
              action={
                hasFilters ? (
                  <Link href="/admin/enrollments" className={secondaryButton}>
                    Clear filters
                  </Link>
                ) : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
