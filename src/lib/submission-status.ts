export const APPLICATION_STATUSES = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "ACCEPTED",
  "DECLINED",
] as const;

export const ENQUIRY_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "RESPONDED",
  "CLOSED",
] as const;

export const REVENUE_LAB_STATUSES = [
  "REGISTERED",
  "ATTENDED",
  "CANCELLED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export type RevenueLabStatus = (typeof REVENUE_LAB_STATUSES)[number];

const labels: Record<string, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  RESPONDED: "Responded",
  CLOSED: "Closed",
  REGISTERED: "Registered",
  ATTENDED: "Attended",
  CANCELLED: "Cancelled",
};

const styles: Record<string, string> = {
  NEW: "border-gold/30 bg-gold/10 text-gold-soft",
  REVIEWING: "border-sky-300/25 bg-sky-400/10 text-sky-100",
  SHORTLISTED: "border-violet-300/25 bg-violet-400/10 text-violet-100",
  ACCEPTED: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  DECLINED: "border-red-300/25 bg-red-400/10 text-red-100",
  IN_PROGRESS: "border-sky-300/25 bg-sky-400/10 text-sky-100",
  RESPONDED: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  CLOSED: "border-cream/15 bg-cream/[0.05] text-cream/45",
  REGISTERED: "border-gold/30 bg-gold/10 text-gold-soft",
  ATTENDED: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  CANCELLED: "border-red-300/25 bg-red-400/10 text-red-100",
};

export function statusLabel(status: string): string {
  return labels[status] ?? status;
}

export function statusClasses(status: string): string {
  return styles[status] ?? "border-cream/15 bg-cream/[0.05] text-cream/45";
}

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}

export function isEnquiryStatus(value: string): value is EnquiryStatus {
  return (ENQUIRY_STATUSES as readonly string[]).includes(value);
}

export function isRevenueLabStatus(value: string): value is RevenueLabStatus {
  return (REVENUE_LAB_STATUSES as readonly string[]).includes(value);
}
