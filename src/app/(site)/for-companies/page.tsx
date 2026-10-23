import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLink,
  ArrowUpRight,
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
  title: "For Companies | Commercial advisory",
  description:
    "Hunt n Farm works with companies on go-to-market strategy, sales process, outbound and pipeline development, and sales team training.",
};

const services = [
  {
    title: "Go-to-market strategy",
    description:
      "Clarify the market, the buyer, the offer, and the route to revenue before the team scales activity.",
  },
  {
    title: "Sales process improvement",
    description:
      "Make the path from first contact to close more visible, usable, and consistent across the team.",
  },
  {
    title: "Outbound and pipeline development",
    description:
      "Build a more deliberate approach to account selection, outreach, and the habits that create pipeline.",
  },
  {
    title: "Sales team training",
    description:
      "Practical training for teams that need stronger discovery, positioning, and commercial conversations.",
  },
];

export default function ForCompaniesPage() {
  return (
    <>
      <PageHero
        index="03"
        eyebrow="For Companies"
        title="Commercial capability, inside the business."
        intro="Hunt n Farm works with leadership and revenue teams on the systems behind consistent commercial performance: the market, the process, the pipeline, and the people."
        aside={
          <div className="border-l border-gold/50 pl-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
              Consulting focus
            </p>
            <p className="mt-3 font-display text-3xl leading-tight tracking-[-0.025em] text-navy">
              Practical engagements shaped around the next stage of growth.
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/contact?topic=consulting" className={primaryButton}>
            Start a conversation
            <ArrowUpRight />
          </Link>
          <Link href="/about" className={secondaryButton}>
            About Hunt n Farm
          </Link>
        </div>
      </PageHero>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <SectionLabel index="04">Where we help</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                Four places commercial performance tends to break.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-ink/65">
                Each engagement starts with the real constraint, not a standard
                deck. The work is designed to be useful to the team doing the
                work.
              </p>
            </div>
            <div>
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="grid gap-4 border-t border-navy/15 py-7 sm:grid-cols-[56px_1fr]"
                >
                  <span className="font-display text-sm text-gold">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl tracking-[-0.025em] text-navy">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-ink/60">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-navy/10 bg-navy py-20 text-cream sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel index="05" tone="dark">
                How we work
              </SectionLabel>
              <h2 className="mt-6 font-display text-4xl leading-[1.02] tracking-[-0.03em] text-cream sm:text-5xl">
                Diagnose. Design. Embed.
              </h2>
              <p className={`${marketingBody} mt-6 max-w-md text-cream/55`}>
                Good advisory should leave the team more capable, not more
                dependent. We aim to leave clear tools, language, and habits
                behind.
              </p>
            </div>
            <div>
              <NumberedRow
                index="01"
                title="Diagnose"
                description="Understand the market, the offer, the funnel, and the behaviours that are helping or hindering progress."
                tone="dark"
              />
              <NumberedRow
                index="02"
                title="Design"
                description="Shape a focused approach to the strategy, process, or capability that needs to change."
                tone="dark"
              />
              <NumberedRow
                index="03"
                title="Embed"
                description="Work with the team to put the approach into practice and make it part of how the business operates."
                tone="dark"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <SectionLabel index="06">Next step</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                Tell us what is changing.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-6 text-ink/65">
                Share the context, the constraint, and what you want the team to
                be able to do differently. We will follow up with a sensible next
                conversation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/contact?topic=consulting" className={primaryButton}>
                Contact us
                <ArrowUpRight />
              </Link>
              <ArrowLink href="/programs" className="self-center">
                See First Quota
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
