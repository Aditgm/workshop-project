import { cache } from "react";
import { z } from "zod";
import { db } from "@/lib/db";

const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().min(1).max(5000);

export const DEFAULT_WORKSHOP_PHOTOS = [
  {
    id: "preset-1",
    label: "Strategy & Deal Review",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-2",
    label: "Team Collaboration",
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-3",
    label: "Executive Coaching",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-4",
    label: "Pitch & Presentation",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-5",
    label: "Live Workshop Session",
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
  },
];

export const workshopItemSchema = z.object({
  id: z.string().trim().min(1).max(100),
  title: z.string().trim().max(250),
  description: z.string().trim().max(4000),
  photos: z.array(z.string().trim().max(1000)).max(20),
  meetingLink: z.string().trim().max(1000),
  time: z.string().trim().max(120),
  date: z.string().trim().max(120),
  badge: z.string().trim().max(100),
  isActive: z.boolean(),
});

export type WorkshopItem = z.infer<typeof workshopItemSchema>;

export const eventPopupSchema = z.object({
  enabled: z.boolean(),
  kicker: z.string().trim().max(120),
  title: z.string().trim().max(250),
  description: z.string().trim().max(2000),
  dateTime: z.string().trim().max(150),
  ctaText: z.string().trim().max(100),
  ctaLink: z.string().trim().max(1000),
  secondaryText: z.string().trim().max(100),
  delaySeconds: z.number().min(0).max(60),
  mode: z.enum(["all_active", "selected", "first_active", "custom"]),
  displayFrequency: z.enum(["every_session", "always", "once_a_day"]),
  showKicker: z.boolean().default(true),
  showDateTime: z.boolean().default(true),
  showDescription: z.boolean().default(true),
  showImage: z.boolean().default(true),
  showSecondaryCta: z.boolean().default(true),
  showCounter: z.boolean().default(true),
  backdropBlur: z.boolean().default(true),
  position: z
    .enum(["bottom_sheet", "bottom_right", "bottom_center"])
    .default("bottom_sheet"),
  selectedWorkshopIds: z.array(z.string().trim().max(100)).default([]),
});

export type EventPopupConfig = z.infer<typeof eventPopupSchema>;


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
  dailyWorkshops: z.array(workshopItemSchema).max(30),
  dailyWorkshop: workshopItemSchema,
  eventPopup: eventPopupSchema,
  consultancy: z.object({
    calendlyUrl: z.string().trim().max(1000),
    headline: z.string().trim().max(250),
    description: z.string().trim().max(3000),
    buttonText: z.string().trim().max(120),
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

const defaultWorkshops: WorkshopItem[] = [
  {
    id: "ws-1",
    title: "Daily Commercial Sprint: Live Pipeline & Deal Review",
    description:
      "Join our live interactive daily workshop where we review real-world pipeline scenarios, buyer objections, and live pitch refinement. Open to revenue professionals, founders, and sales leaders looking to sharpen their sales execution.",
    photos: [
      DEFAULT_WORKSHOP_PHOTOS[0].url,
      DEFAULT_WORKSHOP_PHOTOS[1].url,
    ],
    meetingLink: "https://meet.google.com",
    time: "4:00 PM – 5:00 PM EST",
    date: "Monday to Friday",
    badge: "Today's Live Workshop",
    isActive: true,
  },
  {
    id: "ws-2",
    title: "Discovery & Qualification: Account Context Masterclass",
    description:
      "A hands-on workshop focused on diagnostic questioning, buyer persona mapping, and qualifying opportunities before demoing. Learn how top reps avoid wasted cycles.",
    photos: [
      DEFAULT_WORKSHOP_PHOTOS[2].url,
      DEFAULT_WORKSHOP_PHOTOS[3].url,
    ],
    meetingLink: "https://meet.google.com",
    time: "10:00 AM – 11:30 AM EST",
    date: "Tuesdays & Thursdays",
    badge: "Weekly Lab",
    isActive: true,
  },
  {
    id: "ws-3",
    title: "Executive Outbound & Account Penetration Sprint",
    description:
      "Learn the outbound habits that create enterprise pipeline: account selection, executive triggers, tailored video outreach, and securing the first commercial conversation.",
    photos: [
      DEFAULT_WORKSHOP_PHOTOS[4].url,
      DEFAULT_WORKSHOP_PHOTOS[0].url,
    ],
    meetingLink: "https://meet.google.com",
    time: "2:00 PM – 3:30 PM EST",
    date: "Fridays",
    badge: "Special Masterclass",
    isActive: true,
  },
];

export const defaultEventPopup: EventPopupConfig = {
  enabled: true,
  kicker: "HAPPENING TODAY",
  title: "Revenue Lab: From strategy to action",
  description:
    "Learn one practical way to improve your sales process in this week's live session.",
  dateTime: "Today · 6:00 PM IST",
  ctaText: "Register for free",
  ctaLink: "https://meet.google.com",
  secondaryText: "Maybe later",
  delaySeconds: 0.4,
  mode: "all_active",
  displayFrequency: "always",
  showKicker: true,
  showDateTime: true,
  showDescription: true,
  showImage: true,
  showSecondaryCta: true,
  showCounter: true,
  backdropBlur: true,
  position: "bottom_sheet",
  selectedWorkshopIds: [],
};

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
  dailyWorkshops: defaultWorkshops,
  dailyWorkshop: defaultWorkshops[0],
  eventPopup: defaultEventPopup,
  consultancy: {
    calendlyUrl: "https://calendly.com",
    headline: "Book a Strategic Commercial Advisory Call",
    description:
      "Schedule a 1-on-1 consultation session with our commercial directors to diagnose your sales pipeline, refine outbound motions, or review commercial capability.",
    buttonText: "Schedule Consultation on Calendly",
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
    Object.entries(base).map(([key, fallback]) => {
      if (Array.isArray(fallback) && key in value && Array.isArray((value as Record<string, unknown>)[key])) {
        const valArr = (value as Record<string, unknown>)[key] as unknown[];
        return [key, valArr.length > 0 ? valArr : fallback];
      }
      return [
        key,
        key in value ? withDefaults(fallback, (value as Record<string, unknown>)[key]) : fallback,
      ];
    }),
  );
}

export function parseSiteContent(value: unknown): SiteContent {
  const isObj = isRecord(value);
  const hasDailyWorkshop = isObj && "dailyWorkshop" in value && isRecord(value.dailyWorkshop);
  const hasDailyWorkshops = isObj && "dailyWorkshops" in value && Array.isArray(value.dailyWorkshops);

  let normalizedValue = value;
  if (isObj && hasDailyWorkshop && !hasDailyWorkshops) {
    const rawDw = (value as Record<string, unknown>).dailyWorkshop;
    const completedDw = withDefaults(defaultSiteContent.dailyWorkshop, rawDw);
    normalizedValue = {
      ...value,
      dailyWorkshop: completedDw,
      dailyWorkshops: [completedDw],
    };
  }

  const merged = withDefaults(defaultSiteContent, normalizedValue) as Record<string, unknown>;

  if (Array.isArray(merged.dailyWorkshops) && merged.dailyWorkshops.length > 0) {
    merged.dailyWorkshop = merged.dailyWorkshops[0] as WorkshopItem;
  }

  const parsed = siteContentSchema.safeParse(merged);
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
