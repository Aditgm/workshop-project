import { z } from "zod";
import { emailSchema } from "@/lib/validation";

export const EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5+", label: "5+ years" },
] as const;

export const CONTACT_TOPICS = [
  { value: "first-quota", label: "First Quota" },
  { value: "consulting", label: "Consulting / For Companies" },
  { value: "revenue-lab", label: "Revenue Lab" },
  { value: "rinassa-ai", label: "Rinassa AI" },
  { value: "general", label: "General enquiry" },
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .default("");

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .default("")
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid URL starting with http:// or https://.");

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: emailSchema,
  phone: optionalText(50),
  currentRole: optionalText(120),
  company: optionalText(120),
  experience: z
    .enum(["", "0-1", "1-3", "3-5", "5+"])
    .optional()
    .default(""),
  linkedinUrl: optionalUrl,
  motivation: z
    .string()
    .trim()
    .min(40, "Tell us a little more about why you want to join.")
    .max(2500, "Please keep your answer under 2,500 characters."),
  consent: z
    .boolean()
    .refine((value) => value, "Please confirm that we can use your details to review your application."),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: emailSchema,
  company: optionalText(120),
  topic: z.enum(["first-quota", "consulting", "revenue-lab", "rinassa-ai", "general"]),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your enquiry.")
    .max(2500, "Please keep your message under 2,500 characters."),
});

export const revenueLabSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: emailSchema,
  role: optionalText(120),
  company: optionalText(120),
});

export function contactTopicLabel(value: string): string {
  return CONTACT_TOPICS.find((topic) => topic.value === value)?.label ?? value;
}

export function experienceLabel(value: string | null | undefined): string {
  if (!value) return "Not provided";
  return EXPERIENCE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
