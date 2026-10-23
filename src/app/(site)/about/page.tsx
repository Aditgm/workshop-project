import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";
import {
  ArrowLink,
  ArrowUpRight,
  Container,
  PageHero,
  SectionLabel,
  marketingBody,
  marketingSection,
  marketingSectionTitle,
  primaryButton,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Hunt n Farm is the parent brand for First Quota, Revenue Lab, Rinassa AI, and its commercial advisory work.",
};

const principles = [
  {
    title: "Practical over performative",
    description:
      "The work should be useful beyond the room. We favour clear tools, honest language, and habits people can actually keep.",
  },
  {
    title: "Clarity over hype",
    description:
      "Commercial work is difficult enough without inflated claims. We describe what we do, what we do not do, and where the boundaries are.",
  },
  {
    title: "Community as infrastructure",
    description:
      "People get better by working alongside others. Revenue Lab exists to keep that exchange open and accessible.",
  },
];

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        index="08"
        eyebrow="About Us"
        title="One farm, several ways to grow."
        intro={content.about.intro}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className={primaryButton}>
            Contact Hunt n Farm
            <ArrowUpRight />
          </Link>
          <ArrowLink href="/programs" className="self-center">
            Explore First Quota
          </ArrowLink>
        </div>
      </PageHero>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <SectionLabel index="09">The idea</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                Build capability where the work happens.
              </h2>
            </div>
            <div>
              <p className={`${marketingBody} max-w-2xl`}>
                Hunt n Farm exists to make commercial work more legible and more
                learnable. That means education for people entering the field,
                advisory for teams that need to change how they operate, and a
                community that keeps the conversation honest.
              </p>
              <p className="mt-6 max-w-2xl text-sm leading-6 text-ink/65">
                We are not trying to be everything to everyone. First Quota is
                focused on the early craft of tech sales. Our company work is
                grounded in the same commercial reality. Revenue Lab keeps the
                door open to the wider community. Rinassa AI is a separate
                product thread within the same family.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-navy/10 bg-cream-soft py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel index="10">What sits here</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                The ecosystem.
              </h2>
            </div>
            <div className="grid gap-px border border-navy/15 bg-navy/15 sm:grid-cols-2">
              {[
                {
                  title: "First Quota",
                  label: "Academy",
                  href: "/programs",
                },
                {
                  title: "Revenue Lab",
                  label: "Community",
                  href: "/revenue-lab",
                },
                {
                  title: "For Companies",
                  label: "Advisory",
                  href: "/for-companies",
                },
                {
                  title: "Rinassa AI",
                  label: "Product",
                  href: "/rinassa-ai",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group bg-cream p-6 transition-colors hover:bg-cream-soft"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
                    {item.label}
                  </p>
                  <p className="mt-5 font-display text-3xl tracking-[-0.025em] text-navy">
                    {item.title}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-5 inline-block text-navy/35 transition-transform group-hover:translate-x-1"
                  >
                    &#8594;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="max-w-3xl">
            <SectionLabel index="11">Principles</SectionLabel>
            <h2 className={`${marketingSectionTitle} mt-6`}>
              How we want the work to feel.
            </h2>
          </div>
          <div className="mt-12 grid gap-px border border-navy/15 bg-navy/15 md:grid-cols-3">
            {principles.map((principle, index) => (
              <article key={principle.title} className="bg-cream p-6 sm:p-8">
                <span className="font-display text-sm text-gold">
                  0{index + 1}
                </span>
                <h3 className="mt-7 font-display text-2xl leading-tight tracking-[-0.02em] text-navy">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/60">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
