"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";
import { notifyPublicWorkshopIfNeeded } from "@/lib/notifications";
import {
  firstIssue,
  getString,
  parseDollarsToCents,
  workshopSchema,
} from "@/lib/validation";

function refreshWorkshopPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/admin/workshops");
  revalidatePath(`/workshops/${slug}`);
}

export async function saveWorkshopAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = getString(formData, "id");
  const parsed = workshopSchema.safeParse({
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    summary: getString(formData, "summary"),
    description: getString(formData, "description"),
    type: getString(formData, "type"),
    price: getString(formData, "price"),
    startsAt: getString(formData, "startsAt"),
    endsAt: getString(formData, "endsAt"),
    location: getString(formData, "location"),
    meetingUrl: getString(formData, "meetingUrl"),
    capacity: getString(formData, "capacity"),
    coverImageUrl: getString(formData, "coverImageUrl"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const values = parsed.data;
  const slug = slugify(values.slug || values.title);

  if (!slug) {
    return { error: "Enter a valid slug or title." };
  }

  const conflict = await db.workshop.findFirst({
    where: {
      slug,
      ...(id ? { id: { not: id } } : {}),
    },
    select: { id: true },
  });

  if (conflict) {
    return { error: "That slug is already in use. Choose another one." };
  }

  const priceCents =
    values.type === "PRIVATE" ? (parseDollarsToCents(values.price) ?? 0) : 0;

  const data = {
    slug,
    title: values.title,
    summary: values.summary,
    description: values.description,
    type: values.type,
    priceCents,
    startsAt: new Date(values.startsAt),
    endsAt: values.endsAt ? new Date(values.endsAt) : null,
    location: values.location || null,
    meetingUrl: values.meetingUrl,
    capacity: values.capacity ? Number(values.capacity) : null,
    coverImageUrl: values.coverImageUrl || null,
    published: values.published,
  };

  let workshopId = id;

  try {
    if (id) {
      const existing = await db.workshop.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        return { error: "Workshop not found." };
      }

      await db.workshop.update({ where: { id }, data });
    } else {
      const created = await db.workshop.create({
        data,
        select: { id: true },
      });
      workshopId = created.id;
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "That slug is already in use. Choose another one." };
    }
    throw error;
  }

  if (workshopId) {
    await notifyPublicWorkshopIfNeeded(workshopId);
  }

  refreshWorkshopPages(slug);
  redirect("/admin/workshops");
}

export async function toggleWorkshopPublishedAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = getString(formData, "id");
  const publish = getString(formData, "intent") === "publish";

  if (!id) return;

  const workshop = await db.workshop.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!workshop) return;

  await db.workshop.update({
    where: { id },
    data: { published: publish },
  });

  if (publish) {
    await notifyPublicWorkshopIfNeeded(id);
  }

  refreshWorkshopPages(workshop.slug);
}

export async function deleteWorkshopAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/workshops?error=Workshop+not+found.");
  }

  const workshop = await db.workshop.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      _count: { select: { purchases: true } },
    },
  });

  if (!workshop) {
    redirect("/admin/workshops?error=Workshop+not+found.");
  }

  if (workshop.published) {
    redirect(
      `/admin/workshops?error=${encodeURIComponent(
        "Unpublish the workshop before deleting it.",
      )}`,
    );
  }

  if (workshop._count.purchases > 0) {
    redirect(
      `/admin/workshops?error=${encodeURIComponent(
        "Workshops with enrollment history cannot be deleted.",
      )}`,
    );
  }

  await db.workshop.delete({ where: { id: workshop.id } });
  refreshWorkshopPages(workshop.slug);

  redirect(
    `/admin/workshops?notice=${encodeURIComponent(
      `${workshop.title} was deleted.`,
    )}`,
  );
}
