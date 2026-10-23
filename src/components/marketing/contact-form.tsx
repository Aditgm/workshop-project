"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/actions/marketing";
import { CONTACT_TOPICS } from "@/lib/marketing-validation";
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

export function ContactForm({
  defaultTopic = "general",
}: {
  defaultTopic?: string;
}) {
  const [state, formAction] = useActionState(submitContactAction, null);

  if (state?.success) {
    return <FormSuccess title="Message received" message={state.success} />;
  }

  return (
    <form action={formAction} className="relative grid gap-5">
      <Honeypot id="contact-website" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={fieldLabel}>
            Name <span className="text-gold">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            className={fieldInput}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={fieldLabel}>
            Email <span className="text-gold">*</span>
          </label>
          <input
            id="contact-email"
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
          <label htmlFor="contact-company" className={fieldLabel}>
            Company
          </label>
          <input
            id="contact-company"
            name="company"
            maxLength={120}
            autoComplete="organization"
            className={fieldInput}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="contact-topic" className={fieldLabel}>
            What is this about? <span className="text-gold">*</span>
          </label>
          <select
            id="contact-topic"
            name="topic"
            required
            defaultValue={defaultTopic}
            className={fieldInput}
          >
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={fieldLabel}>
          Message <span className="text-gold">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2500}
          className={fieldTextarea}
          placeholder="Tell us what you are working on and what you need."
        />
      </div>

      <FormState state={state} />
      <FormFootnote>
        Your message is stored securely for the Hunt n Farm team to review. See
        the <FormPrivacyLink />.
      </FormFootnote>

      <div>
        <SubmitButton
          pendingLabel="Sending message..."
          className={`${primaryButton} w-full sm:w-auto`}
        >
          Send message
          <span aria-hidden="true">&#8599;</span>
        </SubmitButton>
      </div>
    </form>
  );
}
