import type { Metadata } from "next";
import Link from "next/link";
import {
  Notice,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { markPurchasePaidByIdentifier } from "@/lib/purchases";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payment confirmation",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const user = await requireUser("/dashboard");
  const query = await searchParams;
  const sessionId = Array.isArray(query.session_id)
    ? query.session_id[0]
    : query.session_id;

  let purchase = sessionId
    ? await db.workshopPurchase.findUnique({
        where: { stripeSessionId: sessionId },
        select: {
          id: true,
          userId: true,
          status: true,
          workshop: {
            select: { slug: true, title: true, startsAt: true },
          },
        },
      })
    : null;

  if (purchase && purchase.userId !== user.id) {
    purchase = null;
  }

  if (purchase && purchase.status !== "PAID" && sessionId && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (
        session.payment_status === "paid" &&
        session.metadata?.userId === user.id
      ) {
        await markPurchasePaidByIdentifier({
          purchaseId: purchase.id,
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        });

        purchase = {
          ...purchase,
          status: "PAID",
        };
      }
    } catch (error) {
      console.error("Could not verify checkout session", error);
    }
  }

  const confirmed = purchase?.status === "PAID";

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <div className={`${panelClass} relative overflow-hidden p-8 text-center sm:p-10`}>
        <div
          className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-violet-500/[0.1] blur-[90px]"
          aria-hidden="true"
        />
        <div
          className={`relative mx-auto grid size-16 place-items-center rounded-full border ${
            confirmed
              ? "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200"
              : "border-amber-300/20 bg-amber-400/[0.08] text-amber-200"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="size-7"
            aria-hidden="true"
          >
            {confirmed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            )}
          </svg>
        </div>

        <h1 className="relative mt-6 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
          {confirmed ? "Payment confirmed." : "Confirming your payment."}
        </h1>
        <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
          {confirmed
            ? "Your access is ready. Open the workshop from your dashboard or directly below."
            : "Stripe is still processing this checkout. Your dashboard will update as soon as the payment is confirmed."}
        </p>

        {purchase ? (
          <div className="relative mt-7 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left">
            <p className="text-sm font-medium text-white">
              {purchase.workshop.title}
            </p>
            <p className="mt-1 text-xs text-white/35">
              {formatDateTime(purchase.workshop.startsAt)}
            </p>
          </div>
        ) : (
          <div className="relative mt-7 text-left">
            <Notice tone="info">
              We could not find a matching checkout for this account. If you were
              charged, check your dashboard or contact support.
            </Notice>
          </div>
        )}

        <div className="relative mt-8 flex flex-col gap-2">
          {confirmed && purchase ? (
            <Link
              href={`/workshops/${purchase.workshop.slug}`}
              className={`${primaryButton} w-full py-3`}
            >
              Open workshop access
            </Link>
          ) : null}
          <Link href="/dashboard" className={`${secondaryButton} w-full py-3`}>
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
