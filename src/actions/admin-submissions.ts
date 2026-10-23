"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  isApplicationStatus,
  isEnquiryStatus,
  isRevenueLabStatus,
} from "@/lib/submission-status";
import { getString } from "@/lib/validation";

export async function updateApplicationStatusAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id || !isApplicationStatus(status)) return;

  await db.application.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
}

export async function updateEnquiryStatusAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id || !isEnquiryStatus(status)) return;

  await db.contactEnquiry.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function updateRevenueLabStatusAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id || !isRevenueLabStatus(status)) return;

  await db.revenueLabRegistration.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/revenue-lab");
  revalidatePath("/admin");
}
