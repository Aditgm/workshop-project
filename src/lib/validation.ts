import { z } from "zod";
import { WORKSHOP_TYPES } from "@/lib/access";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .max(254);

export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .max(72, "Password must be at most 72 characters.");

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Enter your current password.")
      .max(72, "Password must be at most 72 characters."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password.").max(72),
  next: z.string().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(80),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    next: z.string().optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const dateInput = z
  .string()
  .min(1, "Enter a date.")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date.");

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const workshopSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
    slug: z.string().trim().max(80).optional().default(""),
    summary: z
      .string()
      .trim()
      .min(10, "Summary must be at least 10 characters.")
      .max(300),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters.")
      .max(10000),
    type: z.enum(WORKSHOP_TYPES),
    price: z.string().trim().optional().default("0"),
    startsAt: dateInput,
    endsAt: z.string().trim().optional().default(""),
    location: z.string().trim().max(200).optional().default(""),
    meetingUrl: z
      .string()
      .trim()
      .url("Enter a valid meeting URL, including https://.")
      .max(2000)
      .refine(isHttpUrl, "Meeting URL must start with http:// or https://."),
    capacity: z.string().trim().optional().default(""),
    coverImageUrl: z
      .string()
      .trim()
      .optional()
      .default("")
      .refine(
        (value) => value === "" || isHttpUrl(value),
        "Cover image must be an http(s) URL.",
      ),
    published: z.boolean(),
  })
  .superRefine((value, context) => {
    const startsAt = new Date(value.startsAt);
    if (value.endsAt) {
      const endsAt = new Date(value.endsAt);
      if (Number.isNaN(endsAt.getTime())) {
        context.addIssue({
          code: "custom",
          path: ["endsAt"],
          message: "Enter a valid end date.",
        });
      } else if (endsAt <= startsAt) {
        context.addIssue({
          code: "custom",
          path: ["endsAt"],
          message: "End time must be after the start time.",
        });
      }
    }

    if (value.type === "PRIVATE") {
      const cents = parseDollarsToCents(value.price);
      if (cents === null || cents < 100) {
        context.addIssue({
          code: "custom",
          path: ["price"],
          message: "Private workshops need a price of at least $1.00.",
        });
      }
    }

    if (value.capacity) {
      const capacity = Number(value.capacity);
      if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100000) {
        context.addIssue({
          code: "custom",
          path: ["capacity"],
          message: "Capacity must be a whole number greater than zero.",
        });
      }
    }
  });

export const notificationSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters.")
    .max(2000),
  workshopId: z.string().trim().optional().default(""),
});

export function parseDollarsToCents(value: string): number | null {
  if (!value) return 0;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 100000) return null;
  return Math.round(amount * 100);
}

export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}

export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
