import type { Metadata } from "next";
import Link from "next/link";
import { updateEnquiryStatusAction } from "@/actions/admin-submissions";
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
import { contactTopicLabel } from "@/lib/marketing-validation";
import {
  ENQUIRY_STATUSES,
  isEnquiryStatus,
  statusLabel,
} from "@/lib/submission-status";

export const metadata: Metadata = {
  title: "Enquiries",
};

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus =
    params.status && isEnquiryStatus(params.status) ? params.status : null;

  const [enquiries, grouped] = await Promise.all([
    db.contactEnquiry.findMany({
      where: selectedStatus ? { status: selectedStatus } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.contactEnquiry.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const counts = new Map(grouped.map((row) => [row.status, row._count._all]));
  const total = grouped.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Contact"
        title="Enquiries"
        description="Messages submitted through the public contact form."
      />

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/admin/enquiries"
          className={`inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            selectedStatus
              ? "border-cream/15 text-cream/45 hover:border-cream/30 hover:text-cream"
              : "border-gold/35 bg-gold/10 text-gold-soft"
          }`}
        >
          All
          <span className="text-cream/30">{total}</span>
        </Link>
        {ENQUIRY_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/enquiries?status=${status}`}
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
        {enquiries.length ? (
          enquiries.map((enquiry) => (
            <article key={enquiry.id} className={`${adminPanel} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-sm font-semibold text-cream">
                      {enquiry.name}
                    </h2>
                    <StatusPill status={enquiry.status} />
                  </div>
                  <p className="mt-1 text-xs text-cream/35">
                    {enquiry.email}
                    {enquiry.company ? ` · ${enquiry.company}` : ""} ·{" "}
                    {formatDateTime(enquiry.createdAt)}
                  </p>
                </div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-soft">
                  {contactTopicLabel(enquiry.topic)}
                </p>
              </div>

              <p className="mt-5 whitespace-pre-line border-t border-cream/10 pt-4 text-sm leading-6 text-cream/65">
                {enquiry.message}
              </p>

              <form
                action={updateEnquiryStatusAction}
                className="mt-5 flex flex-wrap items-end gap-3 border-t border-cream/10 pt-4"
              >
                <input type="hidden" name="id" value={enquiry.id} />
                <div>
                  <label
                    htmlFor={`enquiry-status-${enquiry.id}`}
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/30"
                  >
                    Enquiry status
                  </label>
                  <select
                    id={`enquiry-status-${enquiry.id}`}
                    name="status"
                    defaultValue={enquiry.status}
                    className={`${adminInput} min-w-44 py-2`}
                  >
                    {ENQUIRY_STATUSES.map((status) => (
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
            </article>
          ))
        ) : (
          <AdminEmpty
            title="No enquiries"
            description={
              selectedStatus
                ? "There are no enquiries with this status."
                : "Messages submitted through the contact form will appear here."
            }
          />
        )}
      </div>
    </div>
  );
}
