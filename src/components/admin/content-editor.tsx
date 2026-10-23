"use client";

import { useActionState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { saveSiteContentAction } from "@/actions/admin-content";
import { SubmitButton } from "@/components/submit-button";
import {
  adminInput,
  adminLabel,
  adminPanel,
  adminPrimaryButton,
  adminTextarea,
} from "@/components/admin/admin-ui";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${adminPanel} p-5 sm:p-6`}>
      <div className="border-b border-cream/10 pb-4">
        <h2 className="font-display text-2xl tracking-[-0.02em] text-cream">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-cream/35">{description}</p>
      </div>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

export function ContentEditor({ content }: { content: SiteContent }) {
  const [state, formAction] = useActionState(saveSiteContentAction, null);

  return (
    <form action={formAction} className="mt-8 grid gap-6">
      {state?.error ? (
        <div
          role="alert"
          className="border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-sm text-red-100"
        >
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div
          role="status"
          className="border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-100"
        >
          {state.success}
        </div>
      ) : null}

      <Section
        title="Home"
        description="The opening statement on the homepage."
      >
        <div>
          <label htmlFor="homeKicker" className={adminLabel}>
            Kicker
          </label>
          <input
            id="homeKicker"
            name="homeKicker"
            defaultValue={content.home.kicker}
            maxLength={120}
            className={adminInput}
          />
        </div>
        <div>
          <label htmlFor="homeTitle" className={adminLabel}>
            Headline
          </label>
          <input
            id="homeTitle"
            name="homeTitle"
            defaultValue={content.home.title}
            maxLength={220}
            className={adminInput}
          />
        </div>
        <div>
          <label htmlFor="homeIntro" className={adminLabel}>
            Introduction
          </label>
          <textarea
            id="homeIntro"
            name="homeIntro"
            defaultValue={content.home.intro}
            maxLength={1400}
            className={adminTextarea}
          />
        </div>
      </Section>

      <Section
        title="First Quota"
        description="Programme facts used across the site."
      >
        <div>
          <label htmlFor="firstQuotaSummary" className={adminLabel}>
            Short summary
          </label>
          <textarea
            id="firstQuotaSummary"
            name="firstQuotaSummary"
            defaultValue={content.firstQuota.summary}
            maxLength={600}
            className={adminTextarea}
          />
        </div>
        <div>
          <label htmlFor="firstQuotaDescription" className={adminLabel}>
            Full description
          </label>
          <textarea
            id="firstQuotaDescription"
            name="firstQuotaDescription"
            defaultValue={content.firstQuota.description}
            maxLength={5000}
            className={`${adminTextarea} min-h-40`}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstQuotaFormat" className={adminLabel}>
              Format
            </label>
            <input
              id="firstQuotaFormat"
              name="firstQuotaFormat"
              defaultValue={content.firstQuota.format}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="firstQuotaDuration" className={adminLabel}>
              Duration
            </label>
            <input
              id="firstQuotaDuration"
              name="firstQuotaDuration"
              defaultValue={content.firstQuota.duration}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="firstQuotaPrice" className={adminLabel}>
              Investment
            </label>
            <input
              id="firstQuotaPrice"
              name="firstQuotaPrice"
              defaultValue={content.firstQuota.price}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="firstQuotaNextCohort" className={adminLabel}>
              Next cohort
            </label>
            <input
              id="firstQuotaNextCohort"
              name="firstQuotaNextCohort"
              defaultValue={content.firstQuota.nextCohort}
              maxLength={200}
              className={adminInput}
            />
          </div>
        </div>
        <div>
          <label htmlFor="firstQuotaAudience" className={adminLabel}>
            Audience
          </label>
          <textarea
            id="firstQuotaAudience"
            name="firstQuotaAudience"
            defaultValue={content.firstQuota.audience}
            maxLength={500}
            className={adminTextarea}
          />
        </div>
        <div>
          <label htmlFor="curriculum" className={adminLabel}>
            Curriculum
          </label>
          <textarea
            id="curriculum"
            name="curriculum"
            defaultValue={content.firstQuota.curriculum.join("\n")}
            className={`${adminTextarea} min-h-44`}
          />
          <p className="mt-2 text-xs text-cream/30">
            One curriculum item per line. Maximum 12 items.
          </p>
        </div>
      </Section>

      <Section
        title="Revenue Lab"
        description="Community copy used on the Revenue Lab page."
      >
        <div>
          <label htmlFor="revenueLabSummary" className={adminLabel}>
            Summary
          </label>
          <textarea
            id="revenueLabSummary"
            name="revenueLabSummary"
            defaultValue={content.revenueLab.summary}
            maxLength={1000}
            className={adminTextarea}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="revenueLabSchedule" className={adminLabel}>
              Rhythm
            </label>
            <input
              id="revenueLabSchedule"
              name="revenueLabSchedule"
              defaultValue={content.revenueLab.schedule}
              maxLength={200}
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="revenueLabFormat" className={adminLabel}>
              Format
            </label>
            <input
              id="revenueLabFormat"
              name="revenueLabFormat"
              defaultValue={content.revenueLab.format}
              maxLength={200}
              className={adminInput}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Contact details"
        description="These details appear in the contact page and footer. Leave blank until they are confirmed."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contactEmail" className={adminLabel}>
              Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={content.contact.email}
              maxLength={254}
              className={adminInput}
              placeholder="Leave blank to use the form"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className={adminLabel}>
              Phone
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              defaultValue={content.contact.phone}
              maxLength={80}
              className={adminInput}
              placeholder="Optional"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contactAddress" className={adminLabel}>
            Address
          </label>
          <textarea
            id="contactAddress"
            name="contactAddress"
            defaultValue={content.contact.address}
            maxLength={300}
            className={adminTextarea}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="contactResponseNote" className={adminLabel}>
            Response note
          </label>
          <textarea
            id="contactResponseNote"
            name="contactResponseNote"
            defaultValue={content.contact.responseNote}
            maxLength={400}
            className={adminTextarea}
          />
        </div>
      </Section>

      <Section
        title="About"
        description="The short brand introduction on the About page."
      >
        <div>
          <label htmlFor="aboutIntro" className={adminLabel}>
            Introduction
          </label>
          <textarea
            id="aboutIntro"
            name="aboutIntro"
            defaultValue={content.about.intro}
            maxLength={3000}
            className={`${adminTextarea} min-h-40`}
          />
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-4 border-t border-cream/10 pt-6">
        <SubmitButton
          pendingLabel="Saving content..."
          className={adminPrimaryButton}
        >
          Save site content
        </SubmitButton>
        <p className="text-xs text-cream/30">
          Changes publish on the public site immediately.
        </p>
      </div>
    </form>
  );
}
