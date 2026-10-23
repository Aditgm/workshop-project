"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/db";
import { siteContentSchema } from "@/lib/site-content";
import { firstIssue, getString } from "@/lib/validation";

export async function saveSiteContentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const curriculum = getString(formData, "curriculum")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const parsed = siteContentSchema.safeParse({
    home: {
      kicker: getString(formData, "homeKicker"),
      title: getString(formData, "homeTitle"),
      intro: getString(formData, "homeIntro"),
    },
    firstQuota: {
      summary: getString(formData, "firstQuotaSummary"),
      description: getString(formData, "firstQuotaDescription"),
      format: getString(formData, "firstQuotaFormat"),
      duration: getString(formData, "firstQuotaDuration"),
      audience: getString(formData, "firstQuotaAudience"),
      price: getString(formData, "firstQuotaPrice"),
      nextCohort: getString(formData, "firstQuotaNextCohort"),
      curriculum,
    },
    revenueLab: {
      summary: getString(formData, "revenueLabSummary"),
      schedule: getString(formData, "revenueLabSchedule"),
      format: getString(formData, "revenueLabFormat"),
    },
    contact: {
      email: getString(formData, "contactEmail"),
      phone: getString(formData, "contactPhone"),
      address: getString(formData, "contactAddress"),
      responseNote: getString(formData, "contactResponseNote"),
    },
    about: {
      intro: getString(formData, "aboutIntro"),
    },
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    const value = parsed.data as unknown as Prisma.InputJsonValue;

    await db.siteSetting.upsert({
      where: { key: "marketing-content" },
      update: { value },
      create: { key: "marketing-content", value },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/content");

    return { success: "Site content saved." };
  } catch {
    return {
      error: "The content could not be saved. Please try again.",
    };
  }
}
