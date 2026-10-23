import { cache } from "react";
import { z } from "zod";
import { db } from "@/lib/db";

const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().min(1).max(5000);

export const siteContentSchema = z.object({
  home: z.object({
    kicker: z.string().trim().min(1).max(120),
    title: z.string().trim().min(1).max(220),
    intro: z.string().trim().min(1).max(1400),
  }),
  firstQuota: z.object({
    summary: z.string().trim().min(1).max(600),
    description: longText,
    format: shortText,
    duration: shortText,
    audience: z.string().trim().min(1).max(500),
    price: shortText,
    nextCohort: shortText,
    curriculum: z.array(z.string().trim().min(1).max(300)).min(1).max(12),
  }),
  revenueLab: z.object({
    summary: z.string().trim().min(1).max(1000),
    schedule: shortText,
    format: shortText,
  }),
  contact: z.object({
    email: z.union([z.literal(""), z.string().trim().email().max(254)]),
    phone: z.string().trim().max(80),
    address: z.string().trim().max(300),
    responseNote: z.string().trim().max(400),
  }),
  about: z.object({
    intro: z.string().trim().min(1).max(3000),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const defaultSiteContent: SiteContent = {
  home: {
    kicker: "Training · Advisory · Community",
    title: "Commercial capability, built for the real work.",
    intro:
      "Hunt n Farm brings together First Quota, our tech-sales academy, practical go-to-market advisory for companies, and Revenue Lab, a free weekly community for revenue professionals.",
  },
  firstQuota: {
    summary:
      "A six-week live online cohort for people building a career in tech sales.",
    description:
      "First Quota is the academy programme at Hunt n Farm. It is designed around the habits that make a commercial professional useful early: understanding the buyer, building account context, running a clear conversation, and managing a pipeline with discipline. The programme is practical, direct, and built for the work that happens before the first deal.",
    format: "Live online",
    duration: "Six weeks",
    audience:
      "Early-career professionals and career switchers preparing for modern tech-sales roles.",
    price: "Cohort fee confirmed during application",
    nextCohort: "Next cohort dates to be announced",
    curriculum: [
      "Foundations of modern tech sales",
      "Buyer research and outbound fundamentals",
      "Discovery, qualification, and account context",
      "Positioning, demos, and value conversations",
      "Pipeline management and forecasting habits",
      "Role readiness, interview practice, and a practical capstone",
    ],
  },
  revenueLab: {
    summary:
      "A free weekly workshop and community for people working in, or moving into, revenue roles. Revenue Lab is a place to practice the craft, compare notes, and stay close to the work.",
    schedule: "Weekly sessions",
    format: "Online and open to join",
  },
  contact: {
    email: "",
    phone: "",
    address: "",
    responseNote:
      "Send a message and the Hunt n Farm team will follow up using the details you provide.",
  },
  about: {
    intro:
      "Hunt n Farm is the parent brand for First Quota, Revenue Lab, and our business advisory work. We bring practical commercial education, go-to-market support, and an open professional community into one place.",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function withDefaults(base: unknown, value: unknown): unknown {
  if (!isRecord(base) || !isRecord(value)) {
    return value === undefined ? base : value;
  }

  return Object.fromEntries(
    Object.entries(base).map(([key, fallback]) => [
      key,
      key in value ? withDefaults(fallback, value[key]) : fallback,
    ]),
  );
}

export function parseSiteContent(value: unknown): SiteContent {
  const parsed = siteContentSchema.safeParse(
    withDefaults(defaultSiteContent, value),
  );
  return parsed.success ? parsed.data : defaultSiteContent;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "marketing-content" },
      select: { value: true },
    });

    return setting ? parseSiteContent(setting.value) : defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
});
