import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminStatCard,
  adminPanel,
} from "@/components/admin/admin-ui";
import { StatusPill } from "@/components/admin/status-pill";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AdminOverviewPage() {
  const [
    applicationCount,
    newApplicationCount,
    enquiryCount,
    newEnquiryCount,
    revenueLabCount,
    recentApplications,
    recentEnquiries,
  ] = await Promise.all([
    db.application.count(),
    db.application.count({ where: { status: "NEW" } }),
    db.contactEnquiry.count(),
    db.contactEnquiry.count({ where: { status: "NEW" } }),
    db.revenueLabRegistration.count(),
    db.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
    db.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        name: true,
        email: true,
        topic: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Hunt n Farm"
        title="Site overview"
        description="Applications, enquiries, and Revenue Lab registrations from the public site."
        actions={
          <>
            <Link
              href="/admin/content"
              className="inline-flex min-h-10 items-center justify-center rounded-[2px] border border-gold bg-gold px-4 py-2.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-soft"
            >
              Edit site content
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-10 items-center justify-center rounded-[2px] border border-cream/20 px-4 py-2.5 text-sm font-semibold text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
            >
              View public site &#8599;
            </Link>
          </>
        }
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Applications"
          value={String(applicationCount)}
          hint={`${newApplicationCount} new`}
          delay={0}
        />
        <AdminStatCard
          label="Enquiries"
          value={String(enquiryCount)}
          hint={`${newEnquiryCount} new`}
          delay={70}
        />
        <AdminStatCard
          label="Revenue Lab"
          value={String(revenueLabCount)}
          hint="Registered"
          delay={140}
        />
        <AdminStatCard
          label="Site content"
          value="Editable"
          hint="Update public copy"
          delay={210}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className={`${adminPanel} p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-4 border-b border-cream/10 pb-4">
            <div>
              <h2 className="font-display text-2xl text-cream">Latest applications</h2>
              <p className="mt-1 text-xs text-cream/35">Awaiting review or recently received.</p>
            </div>
            <Link
              href="/admin/applications"
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-soft transition-colors hover:text-cream"
            >
              View all
            </Link>
          </div>
          <div className="mt-2 divide-y divide-cream/10">
            {recentApplications.length ? (
              recentApplications.map((application) => (
                <Link
                  key={application.id}
                  href="/admin/applications"
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-gold-soft"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cream">
                      {application.fullName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-cream/35">
                      {application.email} · {formatDateTime(application.createdAt)}
                    </p>
                  </div>
                  <StatusPill status={application.status} />
                </Link>
              ))
            ) : (
              <p className="py-8 text-sm text-cream/35">No applications yet.</p>
            )}
          </div>
        </section>

        <section className={`${adminPanel} p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-4 border-b border-cream/10 pb-4">
            <div>
              <h2 className="font-display text-2xl text-cream">Latest enquiries</h2>
              <p className="mt-1 text-xs text-cream/35">Messages from the contact form.</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-soft transition-colors hover:text-cream"
            >
              View all
            </Link>
          </div>
          <div className="mt-2 divide-y divide-cream/10">
            {recentEnquiries.length ? (
              recentEnquiries.map((enquiry) => (
                <Link
                  key={enquiry.id}
                  href="/admin/enquiries"
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-gold-soft"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cream">
                      {enquiry.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-cream/35">
                      {enquiry.topic} · {formatDateTime(enquiry.createdAt)}
                    </p>
                  </div>
                  <StatusPill status={enquiry.status} />
                </Link>
              ))
            ) : (
              <p className="py-8 text-sm text-cream/35">No enquiries yet.</p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/admin/content",
            label: "Site content",
            description: "Update homepage, programme, contact, and about copy.",
          },
          {
            href: "/admin/applications",
            label: "Applications",
            description: "Review First Quota applications and move them through the pipeline.",
          },
          {
            href: "/admin/revenue-lab",
            label: "Revenue Lab",
            description: "Manage the free weekly community registrations.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${adminPanel} group p-5 transition-colors hover:border-gold/30`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
              Manage
            </p>
            <h2 className="mt-3 font-display text-2xl text-cream">{item.label}</h2>
            <p className="mt-2 text-xs leading-5 text-cream/35">{item.description}</p>
            <span
              aria-hidden="true"
              className="mt-5 inline-block text-gold transition-transform group-hover:translate-x-1"
            >
              &#8594;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
