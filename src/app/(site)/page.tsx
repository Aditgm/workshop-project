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
  Rule,
  SectionLabel,
  marketingBody,
  marketingDisplay,
  marketingEyebrow,
  marketingSection,
  marketingSectionTitle,
  primaryButton,
  primaryButtonOnDark,
  secondaryButton,
  secondaryButtonOnDark,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Commercial education, advisory and community",
  description:
    "Hunt n Farm is the home of First Quota, a six-week tech-sales academy, practical go-to-market advisory, and Revenue Lab, a free weekly community.",
};

const offerings = [
  {
    index: "01",
    title: "First Quota",
    label: "Academy",
    description:
      "A six-week live online cohort for people building a career in tech sales.",
    href: "/programs",
    cta: "Explore the programme",
  },
  {
    index: "02",
    title: "For Companies",
    label: "Advisory",
    description:
      "Practical go-to-market, sales process, outbound, and team training support.",
    href: "/for-companies",
    cta: "Work with us",
  },
  {
    index: "03",
    title: "Revenue Lab",
    label: "Community",
    description:
      "A free weekly workshop and community for people working in or moving into revenue.",
    href: "/revenue-lab",
    cta: "Join the lab",
  },
];

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="relative overflow-hidden border-b border-navy/10">
        <Container className="relative grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-28">
          <div className="flex flex-col justify-between">
            <div>
              <SectionLabel index="01">Hunt n Farm</SectionLabel>
              <h1 className={`${marketingDisplay} mt-7 max-w-4xl`}>
                {content.home.title}
              </h1>
              <p className={`${marketingBody} mt-8 max-w-2xl`}>
                {content.home.intro}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/apply" className={primaryButton}>
                  Apply to First Quota
                  <ArrowUpRight />
                </Link>
                <Link href="/programs" className={secondaryButton}>
                  Explore programmes
                </Link>
              </div>
            </div>

            <div className="mt-16 grid gap-4 border-t border-navy/15 pt-6 sm:grid-cols-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/55">
                Six-week cohort
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/55">
                Live online
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/55">
                Revenue Lab · Free weekly
              </p>
            </div>
          </div>

          <aside className="relative">
            <div className="relative overflow-hidden bg-navy p-7 text-cream sm:p-9">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-20 size-64 rounded-full border border-gold/15"
              />
              <div
                aria-hidden="true"
                className="absolute -right-4 top-4 size-36 rounded-full border border-gold/10"
              />
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft">
                The ecosystem
              </p>
              <div className="relative mt-8 divide-y divide-cream/10 border-y border-cream/10">
                {[
                  ["First Quota", "Academy"],
                  ["Revenue Lab", "Community"],
                  ["For Companies", "Advisory"],
                  ["Rinassa AI", "Product"],
                ].map(([name, label], index) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-sm text-gold-soft/70">
                        0{index + 1}
                      </span>
                      <span className="font-display text-2xl tracking-[-0.02em]">
                        {name}
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/35">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="relative mt-8 text-sm leading-6 text-cream/50">
                One place for commercial education, practical advisory, and the
                people doing the work.
              </p>
            </div>
            <p className="mt-4 text-right text-[10px] font-medium uppercase tracking-[0.2em] text-navy/35">
              Education · Advisory · Community
            </p>
          </aside>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="max-w-3xl">
            <SectionLabel index="02">What we do</SectionLabel>
            <h2 className={`${marketingSectionTitle} mt-6`}>
              Practical support for the commercial work that matters.
            </h2>
          </div>

          <div className="mt-14 grid gap-px border border-navy/15 bg-navy/15 md:grid-cols-3">
            {offerings.map((offering) => (
              <article
                key={offering.title}
                className="group flex min-h-[22rem] flex-col justify-between bg-cream p-6 transition-colors hover:bg-cream-soft sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-sm text-gold">
                      {offering.index}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-navy/35">
                      {offering.label}
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-4xl tracking-[-0.03em] text-navy">
                    {offering.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-ink/65">
                    {offering.description}
                  </p>
                </div>
                <ArrowLink href={offering.href} className="mt-10">
                  {offering.cta}
                </ArrowLink>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} relative overflow-hidden bg-navy text-cream`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-10 size-[32rem] rounded-full border border-gold/10"
        />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <SectionLabel index="03" tone="dark">
                First Quota
              </SectionLabel>
              <h2 className="mt-6 font-display text-5xl leading-[0.98] tracking-[-0.035em] text-cream sm:text-6xl">
                Learn the craft
                <span className="block text-cream/40">before the quota.</span>
              </h2>
              <p className="mt-7 max-w-lg text-base leading-7 text-cream/60">
                {content.firstQuota.summary}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/programs" className={primaryButtonOnDark}>
                  Explore First Quota
                  <ArrowUpRight />
                </Link>
                <Link href="/apply" className={secondaryButtonOnDark}>
                  Apply now
                </Link>
              </div>
            </div>

            <div>
              <dl className="grid gap-x-8 sm:grid-cols-2">
                <Fact label="Format" value={content.firstQuota.format} tone="dark" />
                <Fact label="Duration" value={content.firstQuota.duration} tone="dark" />
                <Fact label="Audience" value={content.firstQuota.audience} tone="dark" />
                <Fact label="Next cohort" value={content.firstQuota.nextCohort} tone="dark" />
              </dl>

              <div className="mt-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/35">
                  Inside the cohort
                </p>
                <div className="mt-2">
                  {content.firstQuota.curriculum.slice(0, 3).map((item, index) => (
                    <NumberedRow
                      key={item}
                      index={`0${index + 1}`}
                      title={item}
                      tone="dark"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream-soft`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <SectionLabel index="04">For Companies</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                Build the commercial engine, not just the pitch.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-ink/65">
                Hunt n Farm works with leadership and revenue teams on the
                systems behind consistent commercial performance.
              </p>
              <Link href="/for-companies" className={`${primaryButton} mt-8`}>
                Explore advisory
                <ArrowUpRight />
              </Link>
            </div>

            <div>
              {[
                "Go-to-market strategy",
                "Sales process improvement",
                "Outbound and pipeline development",
                "Sales team training",
              ].map((item, index) => (
                <div
                  key={item}
                  className="grid gap-4 border-t border-navy/15 py-6 sm:grid-cols-[56px_1fr]"
                >
                  <span className="font-display text-sm text-gold">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl tracking-[-0.02em] text-navy">
                      {item}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink/60">
                      A focused engagement shaped around the team, the market,
                      and the next stage of growth.
                    </p>
                  </div>
                </div>
              ))}
              <Rule />
            </div>
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="border border-navy/15 bg-cream-soft p-7 sm:p-9">
              <SectionLabel index="05">Placement</SectionLabel>
              <h2 className="mt-6 font-display text-4xl tracking-[-0.03em] text-navy sm:text-5xl">
                Support for the next step.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-ink/65">
                Placement support sits alongside First Quota. It is designed to
                help participants present their experience clearly and approach
                opportunities with intent.
              </p>
              <Callout title="Important" tone="cream">
                Placement support does not guarantee employment, interviews, or
                offers. Eligibility and scope are reviewed as part of the
                application process.
              </Callout>
              <ArrowLink href="/placement" className="mt-7">
                Read about placement support
              </ArrowLink>
            </article>

            <article className="relative overflow-hidden border border-navy/15 bg-navy p-7 text-cream sm:p-9">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 size-56 rounded-full border border-gold/15"
              />
              <SectionLabel index="06" tone="dark">
                Rinassa AI
              </SectionLabel>
              <h2 className="mt-6 font-display text-4xl tracking-[-0.03em] text-cream sm:text-5xl">
                A new product
                <span className="block text-cream/40">in the farm.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-cream/55">
                Rinassa AI sits within the Hunt n Farm family. This Phase 1
                presence is intentionally simple while the dedicated product
                experience is developed.
              </p>
              <ArrowLink href="/rinassa-ai" tone="dark" className="mt-8">
                Discover Rinassa AI
              </ArrowLink>
            </article>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy py-20 text-cream sm:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(247,242,232,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(247,242,232,0.08)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_right,transparent,black,transparent)]"
        />
        <Container className="relative">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className={`${marketingEyebrow} text-gold-soft`}>
                The next step
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                Start with the work.
                <span className="block text-cream/40">
                  The rest follows.
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row lg:justify-end">
              <Link href="/apply" className={primaryButtonOnDark}>
                Apply to First Quota
                <ArrowUpRight />
              </Link>
              <Link href="/contact" className={secondaryButtonOnDark}>
                Talk to us
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
