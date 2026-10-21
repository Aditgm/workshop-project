"use client";

import { useActionState } from "react";
import { startCheckoutAction } from "@/actions/checkout";
import { primaryButton, Spinner } from "@/components/ui";

export function CheckoutButton({
  workshopId,
  returnTo,
  priceLabel,
  simulated,
}: {
  workshopId: string;
  returnTo: string;
  priceLabel: string;
  simulated: boolean;
}) {
  const [state, formAction, pending] = useActionState(startCheckoutAction, null);

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="workshopId" value={workshopId} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <button
          type="submit"
          disabled={pending}
          className={`${primaryButton} w-full py-3 text-base`}
        >
          {pending ? (
            <>
              <Spinner />
              Starting checkout...
            </>
          ) : (
            `Buy access - ${priceLabel}`
          )}
        </button>
      </form>

      {simulated ? (
        <p className="mt-3 text-xs leading-5 text-amber-200/70">
          Development mode: Stripe is not configured, so this payment will be
          simulated and access granted immediately.
        </p>
      ) : (
        <p className="mt-3 text-xs leading-5 text-white/30">
          Secure checkout by Stripe. Payment confirms access automatically.
        </p>
      )}

      {state?.error ? (
        <p className="mt-3 text-sm font-medium text-rose-300" role="alert">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
