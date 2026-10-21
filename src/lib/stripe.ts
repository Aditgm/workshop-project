import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  stripeClient ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
}

export function getSiteUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL must be set in production.");
  }
  return "http://localhost:3000";
}

export function isDevPaymentSimulationAllowed(): boolean {
  return !isStripeConfigured() && process.env.NODE_ENV !== "production";
}
