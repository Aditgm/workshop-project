"use client";

import { useActionState } from "react";
import { submitApplicationAction } from "@/actions/marketing";
import { EXPERIENCE_OPTIONS } from "@/lib/marketing-validation";
import { SubmitButton } from "@/components/submit-button";
import {
  fieldInput,
  fieldLabel,
  fieldTextarea,
  primaryButton,
} from "@/components/marketing/marketing-ui";
import {
  FormFootnote,
  FormPrivacyLink,
  FormState,
  FormSuccess,
  Honeypot,
} from "@/components/marketing/form-parts";

export function ApplicationForm() {
  const [state, formAction] = useActionState(submitApplicationAction, null);

  if (state?.success) {
    return (
      <FormSuccess
        title="Application received"
        message={state.success}
      >
        <p className="text-sm leading-6 text-ink/60">
          If you would like to add anything, use the contact page and reference
          your application email.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form action={formAction} className="relative grid gap-5">
      <Honeypot id="application-website" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="application-name" className={fieldLabel}>
            Full name <span className="text-gold">*</span>
          </label>
          <input
            id="application-name"
            name="fullName"
            required
            maxLength={120}
            autoComplete="name"
            className={fieldInput}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="application-email" className={fieldLabel}>
            Email <span className="text-gold">*</span>
          </label>
          <input
            id="application-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={fieldInput}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="application-phone" className={fieldLabel}>
            Phone
          </label>
          <input
            id="application-phone"
            name="phone"
            maxLength={50}
            autoComplete="tel"
            className={fieldInput}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="application-experience" className={fieldLabel}>
            Commercial experience
          </label>
          <select
            id="application-experience"
            name="experience"
            className={fieldInput}
            defaultValue=""
          >
            <option value="">Select an option</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="application-role" className={fieldLabel}>
            Current role
          </label>
          <input
            id="application-role"
            name="currentRole"
            maxLength={120}
            autoComplete="organization-title"
            className={fieldInput}
            placeholder="Student, analyst, founder..."
          />
        </div>
        <div>
          <label htmlFor="application-company" className={fieldLabel}>
            Company or institution
          </label>
          <input
            id="application-company"
            name="company"
            maxLength={120}
            autoComplete="organization"
            className={fieldInput}
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label htmlFor="application-linkedin" className={fieldLabel}>
          LinkedIn or portfolio URL
        </label>
        <input
          id="application-linkedin"
          name="linkedinUrl"
          type="url"
          maxLength={500}
          autoComplete="url"
          className={fieldInput}
          placeholder="https://"
        />
      </div>

      <div>
        <label htmlFor="application-motivation" className={fieldLabel}>
          Why First Quota? <span className="text-gold">*</span>
        </label>
        <textarea
          id="application-motivation"
          name="motivation"
          required
          minLength={40}
          maxLength={2500}
          className={fieldTextarea}
          placeholder="Tell us where you are now, what you want to build, and why this programme is the right next step."
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-5 text-ink/65">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-gold"
        />
        <span>
          I confirm that Hunt n Farm may use the details in this application to
          review my submission and contact me about the programme. See the{" "}
          <FormPrivacyLink />.
        </span>
      </label>

      <FormState state={state} />
      <FormFootnote>
        Applications are reviewed manually. Submitting this form does not
        guarantee a place in a cohort.
      </FormFootnote>

      <div>
        <SubmitButton
          pendingLabel="Sending application..."
          className={`${primaryButton} w-full sm:w-auto`}
        >
          Send application
          <span aria-hidden="true">&#8599;</span>
        </SubmitButton>
      </div>
    </form>
  );
}
