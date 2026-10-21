import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import {
  WorkshopForm,
  type WorkshopFormInitial,
} from "@/components/admin/workshop-form";
import { subtleButton } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/format";

export const metadata: Metadata = {
  title: "Edit workshop",
};

export default async function EditWorkshopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const workshop = await db.workshop.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      description: true,
      type: true,
      priceCents: true,
      startsAt: true,
      endsAt: true,
      location: true,
      meetingUrl: true,
      capacity: true,
      coverImageUrl: true,
      published: true,
    },
  });

  if (!workshop) {
    notFound();
  }

  const initial: WorkshopFormInitial = {
    id: workshop.id,
    title: workshop.title,
    slug: workshop.slug,
    summary: workshop.summary,
    description: workshop.description,
    type: workshop.type,
    price: workshop.priceCents ? (workshop.priceCents / 100).toFixed(2) : "",
    startsAt: toDateTimeLocal(workshop.startsAt),
    endsAt: workshop.endsAt ? toDateTimeLocal(workshop.endsAt) : "",
    location: workshop.location ?? "",
    meetingUrl: workshop.meetingUrl,
    capacity: workshop.capacity?.toString() ?? "",
    coverImageUrl: workshop.coverImageUrl ?? "",
    published: workshop.published,
  };

  return (
    <div className="max-w-4xl">
      <Link href="/admin/workshops" className={subtleButton}>
        &larr; Back to workshops
      </Link>
      <div className="mt-3">
        <AdminPageHeader
          eyebrow="Edit session"
          title="Edit workshop"
          description="Changes to published workshops appear immediately. Access links stay protected by the same payment and role rules."
        />
      </div>

      <div className="mt-6">
        <WorkshopForm initial={initial} />
      </div>
    </div>
  );
}
