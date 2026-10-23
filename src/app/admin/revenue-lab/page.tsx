import type { Metadata } from "next";
import Link from "next/link";
import { updateRevenueLabStatusAction } from "@/actions/admin-submissions";
import {
  AdminEmpty,
  AdminPageHeader,
  adminInput,
  adminPanel,
  adminSecondaryButton,
} from "@/components/admin/admin-ui";
import { StatusPill } from "@/components/admin/status-pill";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import {
  isRevenueLabStatus,
  REVENUE_LAB_STATUSES,
  statusLabel,
} from "@/lib/submission-status";

export const metadata: Metadata = {
  title: "Revenue Lab",
};

export default async function AdminRevenueLabPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus =
    params.status && isRevenueLabStatus(params.status) ? params.status : null;

  const [registrations, grouped] = await Promise.all([
    db.revenueLabRegistration.findMany({
      where: selectedStatus ? { status: selectedStatus } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.revenueLabRegistration.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const counts = new Map(grouped.map((row) => [row.status, row._count._all]));
  const total = grouped.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Community"
        title="Revenue Lab"
        description="Free weekly workshop and community registrations. Duplicate emails update the existing record."
      />

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/admin/revenue-lab"
          className={`inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            selectedStatus
              ? "border-cream/15 text-cream/45 hover:border-cream/30 hover:text-cream"
              : "border-gold/35 bg-gold/10 text-gold-soft"
          }`}
        >
          All
          <span className="text-cream/30">{total}</span>
        </Link>
        {REVENUE_LAB_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/revenue-lab?status=${status}`}
            className={`inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
              selectedStatus === status
                ? "border-gold/35 bg-gold/10 text-gold-soft"
                : "border-cream/15 text-cream/45 hover:border-cream/30 hover:text-cream"
            }`}
          >
            {statusLabel(status)}
            <span className="text-cream/30">{counts.get(status) ?? 0}</span>
          </Link>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {registrations.length ? (
          registrations.map((registration) => (
            <article
              key={registration.id}
              className={`${adminPanel} flex flex-wrap items-end justify-between gap-5 p-5`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-sm font-semibold text-cream">
                    {registration.name}
                  </h2>
                  <StatusPill status={registration.status} />
                </div>
                <p className="mt-1 truncate text-xs text-cream/35">
                  {registration.email}
                  {registration.role ? ` · ${registration.role}` : ""}
                  {registration.company ? ` · ${registration.company}` : ""}
                </p>
                <p className="mt-1 text-[10px] text-cream/25">
                  Registered {formatDateTime(registration.createdAt)}
                </p>
              </div>

              <form
                action={updateRevenueLabStatusAction}
                className="flex flex-wrap items-end gap-3"
              >
                <input type="hidden" name="id" value={registration.id} />
                <div>
                  <label
                    htmlFor={`revenue-status-${registration.id}`}
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/30"
                  >
                    Status
                  </label>
                  <select
                    id={`revenue-status-${registration.id}`}
                    name="status"
                    defaultValue={registration.status}
                    className={`${adminInput} min-w-40 py-2`}
                  >
                    {REVENUE_LAB_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className={adminSecondaryButton}>
                  Update
                </button>
              </form>
            </article>
          ))
        ) : (
          <AdminEmpty
            title="No registrations"
            description={
              selectedStatus
                ? "There are no registrations with this status."
                : "Revenue Lab registrations from the public site will appear here."
            }
          />
        )}
      </div>
    </div>
  );
}
