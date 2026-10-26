"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/db";
import { siteContentSchema, type WorkshopItem } from "@/lib/site-content";
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

  let workshops: WorkshopItem[] = [];
  const rawWorkshopsJson = getString(formData, "workshopsJson");
  if (rawWorkshopsJson) {
    try {
      const decoded = JSON.parse(rawWorkshopsJson);
      if (Array.isArray(decoded) && decoded.length > 0) {
        workshops = decoded.map((w: Partial<WorkshopItem>, i: number) => ({
          id: String(w.id || `ws-${i + 1}`),
          title: String(w.title || "").trim(),
          description: String(w.description || "").trim(),
          photos: Array.isArray(w.photos)
            ? w.photos.map((p) => String(p).trim()).filter(Boolean)
            : [],
          meetingLink: String(w.meetingLink || "").trim(),
          time: String(w.time || "").trim(),
          date: String(w.date || "").trim(),
          badge: String(w.badge || "Live Workshop").trim(),
          isActive: Boolean(w.isActive),
        }));
      }
    } catch {
      // ignore
    }
  }

  if (workshops.length === 0) {
    const workshopPhotos = getString(formData, "workshopPhotos")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    workshops = [
      {
        id: "ws-1",
        title: getString(formData, "workshopTitle") || "Daily Commercial Sprint",
        description: getString(formData, "workshopDescription"),
        photos: workshopPhotos,
        meetingLink: getString(formData, "workshopMeetingLink"),
        time: getString(formData, "workshopTime"),
        date: getString(formData, "workshopDate"),
        badge: getString(formData, "workshopBadge") || "Live Daily Workshop",
        isActive:
          formData.get("workshopIsActive") === "on" ||
          formData.get("workshopIsActive") === "true",
      },
    ];
  }

  const eventPopupEnabled =
    formData.get("eventPopupEnabled") === "on" ||
    formData.get("eventPopupEnabled") === "true";

  const rawDelay = parseFloat(getString(formData, "eventPopupDelaySeconds"));
  const delaySeconds =
    !isNaN(rawDelay) && rawDelay >= 0 ? Math.min(Math.max(rawDelay, 0), 60) : 1.5;

  const rawMode = getString(formData, "eventPopupMode");
  const mode =
    rawMode === "first_active" || rawMode === "custom"
      ? rawMode
      : "all_active";

  const rawFreq = getString(formData, "eventPopupDisplayFrequency");
  const displayFrequency =
    rawFreq === "always" || rawFreq === "once_a_day"
      ? rawFreq
      : "every_session";

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
    dailyWorkshops: workshops,
    dailyWorkshop: workshops[0],
    eventPopup: {
      enabled: eventPopupEnabled,
      kicker: getString(formData, "eventPopupKicker") || "HAPPENING TODAY",
      title: getString(formData, "eventPopupTitle"),
      description: getString(formData, "eventPopupDescription"),
      dateTime: getString(formData, "eventPopupDateTime"),
      ctaText: getString(formData, "eventPopupCtaText") || "Register for free",
      ctaLink: getString(formData, "eventPopupCtaLink") || "https://meet.google.com",
      secondaryText: getString(formData, "eventPopupSecondaryText") || "Maybe later",
      delaySeconds,
      mode,
      displayFrequency,
    },
    consultancy: {
      calendlyUrl: getString(formData, "consultancyCalendlyUrl"),
      headline: getString(formData, "consultancyHeadline"),
      description: getString(formData, "consultancyDescription"),
      buttonText: getString(formData, "consultancyButtonText") || "Book Consultation on Calendly",
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
    revalidatePath("/for-companies");
    revalidatePath("/contact");

    return { success: "Site content saved." };
  } catch {
    return {
      error: "The content could not be saved. Please try again.",
    };
  }
}
