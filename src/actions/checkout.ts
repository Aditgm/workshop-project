"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { getSessionUser, loginUrl, safeRedirectPath } from "@/lib/auth";
import { db } from "@/lib/db";
import { markPurchasePaidByIdentifier } from "@/lib/purchases";
import { consumeRateLimit, rateLimitMessage } from "@/lib/rate-limit";
import {
  getSiteUrl,
  getStripe,
  isDevPaymentSimulationAllowed,
  isStripeConfigured,
} from "@/lib/stripe";
import { getString } from "@/lib/validation";

export async function startCheckoutAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getSessionUser();
  const workshopId = getString(formData, "workshopId");
  const fallbackPath = safeRedirectPath(getString(formData, "returnTo"), "/");

  if (!user) {
    redirect(loginUrl(fallbackPath));
  }

  const checkoutLimit = await consumeRateLimit({
    scope: "checkout-user",
    identifier: user.id,
    limit: 30,
    windowSeconds: 60 * 60,
  });

  if (!checkoutLimit.allowed) {
    return { error: rateLimitMessage(checkoutLimit) };
  }

  if (!workshopId) {
    return { error: "Choose a workshop before checking out." };
  }

  const workshop = await db.workshop.findUnique({
    where: { id: workshopId },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      type: true,
      priceCents: true,
      currency: true,
      capacity: true,
      published: true,
    },
  });

  if (
    !workshop ||
    !workshop.published ||
    workshop.type !== "PRIVATE" ||
    workshop.priceCents < 100
  ) {
    return { error: "This workshop is not available for purchase." };
  }

  const existing = await db.workshopPurchase.findUnique({
    where: {
      userId_workshopId: { userId: user.id, workshopId: workshop.id },
    },
  });

  if (existing?.status === "PAID") {
    redirect(`/workshops/${workshop.slug}`);
  }

  if (workshop.capacity !== null) {
    const paidSeats = await db.workshopPurchase.count({
      where: { workshopId: workshop.id, status: "PAID" },
    });

    if (paidSeats >= workshop.capacity) {
      return { error: "This workshop is full." };
    }
  }

  const useDevSimulation = isDevPaymentSimulationAllowed();

  if (!useDevSimulation && !isStripeConfigured()) {
    return {
      error:
        "Payments are not configured yet. Add STRIPE_SECRET_KEY to enable checkout.",
    };
  }

  const purchase = await db.workshopPurchase.upsert({
    where: {
      userId_workshopId: { userId: user.id, workshopId: workshop.id },
    },
    update: {
      amountCents: workshop.priceCents,
      currency: workshop.currency,
      status: "PENDING",
      paidAt: null,
      stripePaymentIntentId: null,
    },
    create: {
      userId: user.id,
      workshopId: workshop.id,
      amountCents: workshop.priceCents,
      currency: workshop.currency,
      status: "PENDING",
    },
  });

  if (useDevSimulation) {
    await markPurchasePaidByIdentifier({ purchaseId: purchase.id });
    redirect(`/workshops/${workshop.slug}?payment=success`);
  }

  if (existing?.stripeSessionId) {
    let redirectAfterReuse: string | null = null;

    try {
      const stripe = getStripe();
      const previous = await stripe.checkout.sessions.retrieve(
        existing.stripeSessionId,
      );

      if (
        previous.status === "complete" &&
        previous.payment_status === "paid"
      ) {
        await markPurchasePaidByIdentifier({
          purchaseId: purchase.id,
          stripeSessionId: previous.id,
          stripePaymentIntentId:
            typeof previous.payment_intent === "string"
              ? previous.payment_intent
              : previous.payment_intent?.id ?? null,
        });
        redirectAfterReuse = `/workshops/${workshop.slug}`;
      } else if (previous.status === "open") {
        const sameAmount =
          previous.amount_total === workshop.priceCents &&
          previous.currency === workshop.currency.toLowerCase();

        if (sameAmount && previous.url) {
          redirectAfterReuse = previous.url;
        } else {
          await stripe.checkout.sessions.expire(previous.id);
        }
      }
    } catch (error) {
      console.warn("Could not reuse an existing Stripe checkout session", error);
    }

    if (redirectAfterReuse) {
      redirect(redirectAfterReuse);
    }
  }

  let checkoutUrl: string | null = null;
  let checkoutSessionId: string | null = null;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      client_reference_id: purchase.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: workshop.currency.toLowerCase(),
            unit_amount: workshop.priceCents,
            product_data: {
              name: workshop.title,
              description: workshop.summary.slice(0, 250),
            },
          },
        },
      ],
      metadata: {
        purchaseId: purchase.id,
        workshopId: workshop.id,
        userId: user.id,
      },
      payment_intent_data: {
        metadata: {
          purchaseId: purchase.id,
          workshopId: workshop.id,
          userId: user.id,
        },
      },
      success_url: `${getSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getSiteUrl()}/workshops/${workshop.slug}?payment=cancelled`,
    });

    checkoutUrl = session.url;
    checkoutSessionId = session.id;
  } catch (error) {
    console.error("Stripe checkout session creation failed", error);
  }

  if (!checkoutUrl) {
    return {
      error: "Could not start checkout. Please try again in a moment.",
    };
  }

  await db.workshopPurchase.update({
    where: { id: purchase.id },
    data: { stripeSessionId: checkoutSessionId },
  });

  redirect(checkoutUrl);
}
