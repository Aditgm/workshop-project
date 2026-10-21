import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { toggleWorkshopPublishedAction } from "@/actions/admin-workshops";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DeleteWorkshopForm } from "@/components/admin/delete-workshop-form";
import { SubmitButton } from "@/components/submit-button";
import {
  Badge,
  EmptyState,
  inputClass,
  Notice,
  primaryButton,
  secondaryButton,
  subtleButton,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Manage workshops",
};

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function AdminWorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
    type?: string | string[];
    notice?: string | string[];
    error?: string | string[];
  }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const q = first(params.q).slice(0, 100);
  const statusFilter = first(params.status);
  const typeFilter = first(params.type);
  const notice = first(params.notice);
  const error = first(params.error);

  const where: Prisma.WorkshopWhereInput = {};

  if (q) {
    where.OR = [{ title: { contains: q } }, { slug: { contains: q } }];
  }

  if (statusFilter === "published") {
    where.published = true;
  } else if (statusFilter === "draft") {
    where.published = false;
  }

  if (typeFilter === "PUBLIC" || typeFilter === "PRIVATE") {
    where.type = typeFilter;
  }

  const [workshops, matchingCount] = await Promise.all([
    db.workshop.findMany({
      where,
      orderBy: [{ startsAt: "asc" }],
      take: 100,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        priceCents: true,
        currency: true,
        startsAt: true,
        published: true,
        notificationSentAt: true,
        _count: { select: { purchases: { where: { status: "PAID" } } } },
      },
    }),
    db.workshop.count({ where }),
  ]);

  const hasFilters = Boolean(q || statusFilter || typeFilter);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Public catalogue"
        title="Workshops"
        description="Control what appears on the public site. Publish when the details are ready, then announce it to members."
        actions={
          <Link href="/admin/workshops/new" className={primaryButton}>
            New workshop
          </Link>
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

      <form
        method="get"
        className="mt-6 flex flex-col gap-2 rounded-[22px] border border-white/10 bg-[#070708]/85 p-3 shadow-sm sm:flex-row sm:items-center"
      >
        <label htmlFor="workshop-search" className="sr-only">
          Search workshops
        </label>
        <input
          id="workshop-search"
          name="q"
          defaultValue={q}
          className={`${inputClass} sm:max-w-xs`}
          placeholder="Search title or slug"
        />
        <label htmlFor="workshop-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="workshop-status"
          name="status"
          defaultValue={statusFilter}
          className={`${inputClass} sm:max-w-40`}
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <label htmlFor="workshop-type" className="sr-only">
          Filter by access
        </label>
        <select
          id="workshop-type"
          name="type"
          defaultValue={typeFilter}
          className={`${inputClass} sm:max-w-40`}
        >
          <option value="">All access</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Paid</option>
        </select>
        <button type="submit" className={secondaryButton}>
          Apply filters
        </button>
        {hasFilters ? (
          <Link href="/admin/workshops" className={subtleButton}>
            Clear
          </Link>
        ) : null}
      </form>

      <div className="mt-4 overflow-hidden rounded-[25px] border border-white/10 bg-[#070708]/85 shadow-sm">
        {workshops.length > 0 ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-3 text-xs text-white/30">
              <span>
                Showing {workshops.length} of {matchingCount} workshop
                {matchingCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wide text-white/30">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Workshop</th>
                    <th className="px-5 py-3 font-semibold">Access</th>
                    <th className="px-5 py-3 font-semibold">Price</th>
                    <th className="px-5 py-3 font-semibold">Starts</th>
                    <th className="px-5 py-3 font-semibold">Paid seats</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {workshops.map((workshop) => (
                    <tr
                      key={workshop.id}
                      className="align-top transition-colors hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/workshops/${workshop.slug}`}
                          className="font-medium text-white hover:text-white"
                        >
                          {workshop.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-white/30">
                          /{workshop.slug}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          tone={
                            workshop.type === "PRIVATE" ? "amber" : "green"
                          }
                        >
                          {workshop.type === "PRIVATE" ? "Paid" : "Public"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-white/60">
                        {formatPrice(workshop.priceCents, workshop.currency)}
                      </td>
                      <td className="px-5 py-4 text-white/40">
                        {formatDateTime(workshop.startsAt)}
                      </td>
                      <td className="px-5 py-4 text-white/60">
                        {workshop._count.purchases}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <Badge
                            tone={workshop.published ? "green" : "slate"}
                          >
                            {workshop.published ? "Published" : "Draft"}
                          </Badge>
                          {workshop.published &&
                          workshop.type === "PUBLIC" &&
                          !workshop.notificationSentAt ? (
                            <Badge tone="amber">Not announced</Badge>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
                          <Link
                            href={`/admin/workshops/${workshop.id}/edit`}
                            className={subtleButton}
                          >
                            Edit
                          </Link>
                          <form action={toggleWorkshopPublishedAction}>
                            <input
                              type="hidden"
                              name="id"
                              value={workshop.id}
                            />
                            <input
                              type="hidden"
                              name="intent"
                              value={
                                workshop.published ? "unpublish" : "publish"
                              }
                            />
                            <SubmitButton
                              className={
                                workshop.published
                                  ? secondaryButton
                                  : primaryButton
                              }
                              pendingLabel="Updating..."
                            >
                              {workshop.published ? "Unpublish" : "Publish"}
                            </SubmitButton>
                          </form>
                          {!workshop.published &&
                          workshop._count.purchases === 0 ? (
                            <DeleteWorkshopForm
                              id={workshop.id}
                              title={workshop.title}
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-white/[0.07] xl:hidden">
              {workshops.map((workshop) => (
                <article key={workshop.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/workshops/${workshop.slug}`}
                        className="font-medium text-white hover:text-white"
                      >
                        {workshop.title}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-white/30">
                        /{workshop.slug}
                      </p>
                    </div>
                    <Badge
                      tone={workshop.type === "PRIVATE" ? "amber" : "green"}
                    >
                      {workshop.type === "PRIVATE" ? "Paid" : "Public"}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge tone={workshop.published ? "green" : "slate"}>
                      {workshop.published ? "Published" : "Draft"}
                    </Badge>
                    {workshop.published &&
                    workshop.type === "PUBLIC" &&
                    !workshop.notificationSentAt ? (
                      <Badge tone="amber">Not announced</Badge>
                    ) : null}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.025] p-3 text-xs">
                    <div className="col-span-2">
                      <p className="font-semibold text-white/30">Starts</p>
                      <p className="mt-0.5 text-white/60">
                        {formatDateTime(workshop.startsAt)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-white/30">Price</p>
                      <p className="mt-0.5 text-white/60">
                        {formatPrice(
                          workshop.priceCents,
                          workshop.currency,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-white/30">
                        Paid seats
                      </p>
                      <p className="mt-0.5 text-white/60">
                        {workshop._count.purchases}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/workshops/${workshop.id}/edit`}
                      className={subtleButton}
                    >
                      Edit
                    </Link>
                    <form action={toggleWorkshopPublishedAction}>
                      <input type="hidden" name="id" value={workshop.id} />
                      <input
                        type="hidden"
                        name="intent"
                        value={workshop.published ? "unpublish" : "publish"}
                      />
                      <SubmitButton
                        className={
                          workshop.published
                            ? secondaryButton
                            : primaryButton
                        }
                        pendingLabel="Updating..."
                      >
                        {workshop.published ? "Unpublish" : "Publish"}
                      </SubmitButton>
                    </form>
                    {!workshop.published &&
                    workshop._count.purchases === 0 ? (
                      <DeleteWorkshopForm
                        id={workshop.id}
                        title={workshop.title}
                      />
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No workshops found"
              description="Try a different search or filter, or create a new workshop for the public catalogue."
              action={
                hasFilters ? (
                  <Link href="/admin/workshops" className={secondaryButton}>
                    Clear filters
                  </Link>
                ) : (
                  <Link href="/admin/workshops/new" className={primaryButton}>
                    New workshop
                  </Link>
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
