import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";
import {
  ArrowLink,
  ArrowUpRight,
  Callout,
  Container,
  Fact,
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
  title: "First Quota | Six-week tech-sales academy",
  description:
    "First Quota is Hunt n Farm's six-week live online academy for people building a career in tech sales.",
};

export default async function ProgramsPage() {
  const content = await getSiteContent();
  const program = content.firstQuota;

  return (
    <>
      <PageHero
        index="01"
        eyebrow="The Academy"
        title="First Quota"
        intro={program.summary}
        aside={
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
            <Fact label="Format" value={program.format} />
            <Fact label="Duration" value={program.duration} />
            <Fact label="Next cohort" value={program.nextCohort} />
            <Fact label="Investment" value={program.price} />
          </dl>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/apply" className={primaryButton}>
            Apply to First Quota
            <ArrowUpRight />
          </Link>
          <Link href="/contact" className={secondaryButton}>
            Ask a question
          </Link>
        </div>
      </PageHero>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <SectionLabel index="02">The programme</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                Built around the work before the first deal.
              </h2>
            </div>
            <div>
              <p className={`${marketingBody} max-w-2xl`}>{program.description}</p>
              <div className="mt-10 border border-navy/15 bg-cream-soft p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Who it is for
                </p>
                <p className="mt-3 font-display text-2xl leading-snug tracking-[-0.02em] text-navy">
                  {program.audience}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-navy/10 bg-cream-soft py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <SectionLabel index="03">Curriculum</SectionLabel>
            <h2 className={`${marketingSectionTitle} mt-6`}>
              Six weeks. Six parts of the craft.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-ink/65">
              Each week focuses on a practical part of modern tech sales, with
              space to apply it through exercises and discussion.
            </p>
          </div>

          <div className="mt-12 grid gap-x-16 lg:grid-cols-2">
            {program.curriculum.map((item, index) => (
              <NumberedRow
                key={item}
                index={`0${index + 1}`}
                title={item}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel index="04">How to apply</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                A straightforward process.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-ink/65">
                We review each application to understand your starting point and
                whether the cohort is the right fit.
              </p>
              <Link href="/apply" className={`${primaryButton} mt-8`}>
                Start your application
                <ArrowUpRight />
              </Link>
            </div>

            <div>
              {[
                {
                  title: "Submit your application",
                  description:
                    "Tell us your background, what you want to build, and why First Quota is the right next step.",
                },
                {
                  title: "Application review",
                  description:
                    "The team reviews your application. If there is a good fit, we follow up with next steps and any outstanding questions.",
                },
                {
                  title: "Cohort decision",
                  description:
                    "Fees, dates, and cohort details are confirmed before you commit. Applying does not guarantee a place.",
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="grid gap-4 border-t border-navy/15 py-6 sm:grid-cols-[56px_1fr]"
                >
                  <span className="font-display text-sm text-gold">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl tracking-[-0.02em] text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-ink/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Callout title="Placement support">
              <p>
                Placement support sits alongside First Quota. It is designed to
                help participants present their experience and approach
                opportunities with intent. It does not guarantee employment,
                interviews, or offers.
              </p>
              <ArrowLink href="/placement" className="mt-4">
                Read about placement
              </ArrowLink>
            </Callout>
            <Callout title="Fees and dates" tone="navy">
              <p>
                The next cohort dates and cohort fee are confirmed during the
                application process. We do not ask you to commit before those
                details are clear.
              </p>
            </Callout>
          </div>
        </Container>
      </section>
    </>
  );
}
