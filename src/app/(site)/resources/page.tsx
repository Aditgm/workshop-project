import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLink,
  ArrowUpRight,
  Container,
  PageHero,
  SectionLabel,
  marketingSection,
  marketingSectionTitle,
  primaryButton,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Start with the Hunt n Farm resources on First Quota, placement support, Revenue Lab, and commercial advisory.",
};

const resources = [
  {
    index: "01",
    title: "The First Quota programme",
    description:
      "The full curriculum, format, audience, and application path for the six-week academy.",
    href: "/programs",
    cta: "Read the programme",
  },
  {
    index: "02",
    title: "Placement support",
    description:
      "What placement support includes, who it is for, and the boundaries that apply.",
    href: "/placement",
    cta: "Understand placement",
  },
  {
    index: "03",
    title: "Revenue Lab",
    description:
      "Join the free weekly workshop and community for people working in or moving into revenue.",
    href: "/revenue-lab",
    cta: "Join the lab",
  },
  {
    index: "04",
    title: "Company advisory",
    description:
      "Where Hunt n Farm helps companies with go-to-market, process, pipeline, and team capability.",
    href: "/for-companies",
    cta: "Explore advisory",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        index="04"
        eyebrow="Resources"
        title="Start with the useful parts."
        intro="A small, practical set of starting points for people considering First Quota, working in revenue, or looking for commercial support inside a company."
      >
        <Link href="/apply" className={primaryButton}>
          Apply to First Quota
          <ArrowUpRight />
        </Link>
      </PageHero>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="max-w-3xl">
            <SectionLabel index="05">Start here</SectionLabel>
            <h2 className={`${marketingSectionTitle} mt-6`}>
              The work, without the noise.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-ink/65">
              We are building the wider resource library over time. In the
              meantime, these pages cover the questions we are asked most often.
            </p>
          </div>

          <div className="mt-12 grid gap-px border border-navy/15 bg-navy/15 md:grid-cols-2">
            {resources.map((resource) => (
              <article
                key={resource.href}
                className="flex min-h-[17rem] flex-col justify-between bg-cream p-6 transition-colors hover:bg-cream-soft sm:p-8"
              >
                <div>
                  <span className="font-display text-sm text-gold">
                    {resource.index}
                  </span>
                  <h3 className="mt-7 font-display text-3xl tracking-[-0.025em] text-navy">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/60">
                    {resource.description}
                  </p>
                </div>
                <ArrowLink href={resource.href} className="mt-8">
                  {resource.cta}
                </ArrowLink>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-navy/10 bg-cream-soft py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <SectionLabel index="06">A practical note</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                No shortcuts, no inflated promises.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-6 text-ink/65">
                Our resources are designed to help you make a clearer decision:
                about the programme, the support, or the next conversation. If
                something is not covered, ask us directly.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 border-l border-gold/50 pl-6 sm:flex-row lg:justify-end">
              <Link href="/contact" className={primaryButton}>
                Ask a question
                <ArrowUpRight />
              </Link>
              <ArrowLink href="/about" className="self-center">
                About Hunt n Farm
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
