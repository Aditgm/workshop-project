import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { ApplicationForm } from "@/components/marketing/application-form";
import {
  Container,
  Fact,
  PageHero,
  SectionLabel,
  marketingSection,
  marketingSectionTitle,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Apply to First Quota",
  description:
    "Apply to First Quota, Hunt n Farm's six-week live online tech-sales academy.",
};

export default async function ApplyPage() {
  const content = await getSiteContent();
  const program = content.firstQuota;

  return (
    <>
      <PageHero
        index="10"
        eyebrow="Apply Now"
        title="Apply to First Quota."
        intro="Tell us where you are now and what you want to build. Applications are reviewed manually, and we will follow up by email."
        aside={
          <dl>
            <Fact label="Programme" value="First Quota" />
            <Fact label="Format" value={program.format} />
            <Fact label="Duration" value={program.duration} />
            <Fact label="Next cohort" value={program.nextCohort} />
          </dl>
        }
      />

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <SectionLabel index="11">Before you apply</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                A few honest notes.
              </h2>
              <div className="mt-8 space-y-5 text-sm leading-6 text-ink/65">
                <p>
                  First Quota is designed for people who want to build a career
                  in tech sales and are ready to engage with the work.
                </p>
                <p>
                  The cohort is delivered live online over six weeks. Cohort
                  dates and fees are confirmed before you commit.
                </p>
                <p>
                  Applying does not guarantee a place. We review each
                  application for fit and follow up with next steps.
                </p>
              </div>

              <div className="mt-8 border-t border-navy/15 pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Helpful to have ready
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/65">
                  <li>Your current role or starting point</li>
                  <li>A clear reason for choosing tech sales</li>
                  <li>A LinkedIn or portfolio link, if you have one</li>
                </ul>
              </div>
            </div>

            <div className="border border-navy/15 bg-cream-soft p-6 sm:p-8">
              <ApplicationForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
