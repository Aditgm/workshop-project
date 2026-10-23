"use client";

import { useActionState } from "react";
import { submitRevenueLabAction } from "@/actions/marketing";
import { SubmitButton } from "@/components/submit-button";
import {
  fieldInput,
  fieldLabel,
  primaryButton,
} from "@/components/marketing/marketing-ui";
import {
  FormFootnote,
  FormPrivacyLink,
  FormState,
  FormSuccess,
  Honeypot,
} from "@/components/marketing/form-parts";

export function RevenueLabForm() {
  const [state, formAction] = useActionState(submitRevenueLabAction, null);

  if (state?.success) {
    return (
      <FormSuccess
        title="You are on the list"
        message={state.success}
      />
    );
  }

  return (
    <form action={formAction} className="relative grid gap-5">
      <Honeypot id="revenue-lab-website" />

      <div>
        <label htmlFor="revenue-lab-name" className={fieldLabel}>
          Name <span className="text-gold">*</span>
        </label>
        <input
          id="revenue-lab-name"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className={fieldInput}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="revenue-lab-email" className={fieldLabel}>
          Email <span className="text-gold">*</span>
        </label>
        <input
          id="revenue-lab-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className={fieldInput}
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="revenue-lab-role" className={fieldLabel}>
            Role
          </label>
          <input
            id="revenue-lab-role"
            name="role"
            maxLength={120}
            autoComplete="organization-title"
            className={fieldInput}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="revenue-lab-company" className={fieldLabel}>
            Company
          </label>
          <input
            id="revenue-lab-company"
            name="company"
            maxLength={120}
            autoComplete="organization"
            className={fieldInput}
            placeholder="Optional"
          />
        </div>
      </div>

      <FormState state={state} />
      <FormFootnote>
        Registration is free. We use your details only to share Revenue Lab
        sessions and updates. See the <FormPrivacyLink />.
      </FormFootnote>

      <div>
        <SubmitButton
          pendingLabel="Joining..."
          className={`${primaryButton} w-full sm:w-auto`}
        >
          Join Revenue Lab
          <span aria-hidden="true">&#8599;</span>
        </SubmitButton>
      </div>
    </form>
  );
}
