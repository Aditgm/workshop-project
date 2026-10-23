import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLink,
  ArrowUpRight,
  Callout,
  Container,
  NumberedRow,
  PageHero,
  SectionLabel,
  marketingBody,
  marketingSection,
  marketingSectionTitle,
  primaryButton,
  secondaryButton,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Placement support",
  description:
    "Placement support for First Quota participants, with a clear statement that employment, interviews, and offers are not guaranteed.",
};

export default function PlacementPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Placement"
        title="Support for the next step."
        intro="Placement support sits alongside First Quota. It is designed to help participants present their experience clearly, target the right opportunities, and approach the process with more intent."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/apply" className={primaryButton}>
            Apply to First Quota
            <ArrowUpRight />
          </Link>
          <Link href="/contact" className={secondaryButton}>
            Ask about eligibility
          </Link>
        </div>
      </PageHero>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <SectionLabel index="03">The support</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                Practical, honest, and bounded.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-ink/65">
                Placement is not a promise of a job. It is a structured layer of
                support for participants who are ready to make the move.
              </p>
            </div>

            <div>
              <p className={`${marketingBody} max-w-2xl`}>
                The exact scope is confirmed with each cohort. Support may
                include help with narrative and positioning, preparation for
                relevant conversations, and guidance on how to approach the
                market with a clearer point of view.
              </p>

              <div className="mt-10">
                <NumberedRow
                  index="01"
                  title="Present your experience"
                  description="Build a clearer account of what you can do, the value you bring, and the kind of role that fits."
                />
                <NumberedRow
                  index="02"
                  title="Target the right conversations"
                  description="Think more deliberately about the companies, teams, and roles that match your direction."
                />
                <NumberedRow
                  index="03"
                  title="Prepare with intent"
                  description="Approach interviews and commercial conversations with a stronger point of view and a practical way to talk about your work."
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-navy/10 bg-cream-soft py-20 sm:py-28">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionLabel index="04">Eligibility</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                Reviewed with the application.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-6 text-ink/65">
                Placement support is not automatic for every applicant.
                Eligibility, timing, and the specific scope are discussed as
                part of the First Quota application process. Availability may
                vary by cohort.
              </p>
              <ArrowLink href="/apply" className="mt-6">
                Start an application
              </ArrowLink>
            </div>

            <Callout title="No employment guarantee">
              <p className="text-base leading-7">
                Hunt n Farm does not guarantee employment, job interviews,
                placements, or offers. Outcomes depend on the participant, the
                market, the role, and factors outside our control. Any support
                is provided with that boundary clearly understood.
              </p>
            </Callout>
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 border-t border-navy/15 pt-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                First Quota
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] text-navy">
                Build the capability first.
              </h2>
            </div>
            <Link href="/programs" className={primaryButton}>
              Explore the programme
              <ArrowUpRight />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
