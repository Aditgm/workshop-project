"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/db";
import {
  applicationSchema,
  contactSchema,
  revenueLabSchema,
} from "@/lib/marketing-validation";
import {
  consumeRateLimit,
  rateLimitMessage,
} from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { firstIssue, getString } from "@/lib/validation";

function emptyToNull(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function isHoneypotFilled(formData: FormData): boolean {
  return getString(formData, "website").trim().length > 0;
}

export async function submitApplicationAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const limit = await consumeRateLimit({
    scope: "marketing-application",
    identifier: await getClientIp(),
    limit: 6,
    windowSeconds: 60 * 60,
  });

  if (!limit.allowed) {
    return { error: rateLimitMessage(limit) };
  }

  if (isHoneypotFilled(formData)) {
    return {
      success:
        "Your application has been received. The team will follow up by email.",
    };
  }

  const parsed = applicationSchema.safeParse({
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    currentRole: getString(formData, "currentRole"),
    company: getString(formData, "company"),
    experience: getString(formData, "experience"),
    linkedinUrl: getString(formData, "linkedinUrl"),
    motivation: getString(formData, "motivation"),
    consent: getString(formData, "consent") === "on",
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    await db.application.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: emptyToNull(parsed.data.phone),
        currentRole: emptyToNull(parsed.data.currentRole),
        company: emptyToNull(parsed.data.company),
        experience: emptyToNull(parsed.data.experience),
        linkedinUrl: emptyToNull(parsed.data.linkedinUrl),
        motivation: parsed.data.motivation,
      },
    });

    revalidatePath("/admin/applications");
    revalidatePath("/admin");

    return {
      success:
        "Your application has been received. The team will follow up by email.",
    };
  } catch {
    return {
      error:
        "We could not submit your application. Please try again in a moment.",
    };
  }
}

export async function submitContactAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const limit = await consumeRateLimit({
    scope: "marketing-contact",
    identifier: await getClientIp(),
    limit: 8,
    windowSeconds: 60 * 60,
  });

  if (!limit.allowed) {
    return { error: rateLimitMessage(limit) };
  }

  if (isHoneypotFilled(formData)) {
    return {
      success:
        "Your message has been received. The team will follow up using the details provided.",
    };
  }

  const parsed = contactSchema.safeParse({
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    company: getString(formData, "company"),
    topic: getString(formData, "topic"),
    message: getString(formData, "message"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    await db.contactEnquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: emptyToNull(parsed.data.company),
        topic: parsed.data.topic,
        message: parsed.data.message,
      },
    });

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return {
      success:
        "Your message has been received. The team will follow up using the details provided.",
    };
  } catch {
    return {
      error: "We could not send your message. Please try again in a moment.",
    };
  }
}

export async function submitRevenueLabAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const limit = await consumeRateLimit({
    scope: "marketing-revenue-lab",
    identifier: await getClientIp(),
    limit: 10,
    windowSeconds: 60 * 60,
  });

  if (!limit.allowed) {
    return { error: rateLimitMessage(limit) };
  }

  if (isHoneypotFilled(formData)) {
    return {
      success:
        "You are on the Revenue Lab list. The team will follow up with session details.",
    };
  }

  const parsed = revenueLabSchema.safeParse({
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    role: getString(formData, "role"),
    company: getString(formData, "company"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  try {
    await db.revenueLabRegistration.upsert({
      where: { email: parsed.data.email },
      update: {
        name: parsed.data.name,
        role: emptyToNull(parsed.data.role),
        company: emptyToNull(parsed.data.company),
        status: "REGISTERED",
      },
      create: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: emptyToNull(parsed.data.role),
        company: emptyToNull(parsed.data.company),
      },
    });

    revalidatePath("/admin/revenue-lab");
    revalidatePath("/admin");

    return {
      success:
        "You are on the Revenue Lab list. The team will follow up with session details.",
    };
  } catch {
    return {
      error:
        "We could not complete your registration. Please try again in a moment.",
    };
  }
}
