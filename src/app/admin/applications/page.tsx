import type { Metadata } from "next";
import Link from "next/link";
import { updateApplicationStatusAction } from "@/actions/admin-submissions";
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
import { experienceLabel } from "@/lib/marketing-validation";
import {
  APPLICATION_STATUSES,
  isApplicationStatus,
  statusLabel,
} from "@/lib/submission-status";

export const metadata: Metadata = {
  title: "Applications",
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus =
    params.status && isApplicationStatus(params.status) ? params.status : null;

  const [applications, grouped] = await Promise.all([
    db.application.findMany({
      where: selectedStatus ? { status: selectedStatus } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.application.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const counts = new Map(grouped.map((row) => [row.status, row._count._all]));
  const total = grouped.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <div>
      <AdminPageHeader
        eyebrow="First Quota"
        title="Applications"
        description="Review applications, keep statuses current, and follow up using the contact details provided."
      />

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/admin/applications"
          className={`inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            selectedStatus
              ? "border-cream/15 text-cream/45 hover:border-cream/30 hover:text-cream"
              : "border-gold/35 bg-gold/10 text-gold-soft"
          }`}
        >
          All
          <span className="text-cream/30">{total}</span>
        </Link>
        {APPLICATION_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/applications?status=${status}`}
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
        {applications.length ? (
          applications.map((application) => (
            <details
              key={application.id}
              className={`${adminPanel} group overflow-hidden`}
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-4 transition-colors hover:bg-cream/[0.02] sm:p-5 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-cream">
                    {application.fullName}
                  </p>
                  <p className="mt-1 truncate text-xs text-cream/35">
                    {application.email} · {formatDateTime(application.createdAt)}
                  </p>
                </div>
                <StatusPill status={application.status} />
                <span
                  aria-hidden="true"
                  className="text-xs text-cream/30 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <div className="border-t border-cream/10 p-4 sm:p-5">
                <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["Phone", application.phone || "Not provided"],
                    ["Current role", application.currentRole || "Not provided"],
                    ["Company", application.company || "Not provided"],
                    [
                      "Experience",
                      experienceLabel(application.experience),
                    ],
                    ["LinkedIn", application.linkedinUrl || "Not provided"],
                    ["Consent", formatDateTime(application.consentAt)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/30">
                        {label}
                      </dt>
                      <dd className="mt-1 break-words text-cream/70">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 border-t border-cream/10 pt-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/30">
                    Motivation
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-cream/65">
                    {application.motivation}
                  </p>
                </div>

                <form
                  action={updateApplicationStatusAction}
                  className="mt-6 flex flex-wrap items-end gap-3 border-t border-cream/10 pt-4"
                >
                  <input type="hidden" name="id" value={application.id} />
                  <div>
                    <label
                      htmlFor={`status-${application.id}`}
                      className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/30"
                    >
                      Application status
                    </label>
                    <select
                      id={`status-${application.id}`}
                      name="status"
                      defaultValue={application.status}
                      className={`${adminInput} min-w-44 py-2`}
                    >
                      {APPLICATION_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className={adminSecondaryButton}>
                    Update status
                  </button>
                </form>
              </div>
            </details>
          ))
        ) : (
          <AdminEmpty
            title="No applications"
            description={
              selectedStatus
                ? "There are no applications with this status."
                : "Applications submitted through the public site will appear here."
            }
          />
        )}
      </div>
    </div>
  );
}
