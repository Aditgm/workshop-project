import type Stripe from "stripe";
import {
  expirePendingPurchaseBySessionId,
  markPurchasePaidByIdentifier,
  refundPurchaseByPaymentIntentId,
} from "@/lib/purchases";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json(
      { error: "Stripe webhooks are not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (
          session.payment_status === "paid" ||
          session.payment_status === "no_payment_required"
        ) {
          await markPurchasePaidByIdentifier({
            purchaseId: session.metadata?.purchaseId ?? session.client_reference_id,
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
          });
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await expirePendingPurchaseBySessionId(session.id);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.refunded && typeof charge.payment_intent === "string") {
          await refundPurchaseByPaymentIntentId(charge.payment_intent);
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handling failed", error);
    return Response.json({ error: "Webhook handling failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
