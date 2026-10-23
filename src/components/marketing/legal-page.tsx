import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Container,
  SectionLabel,
  primaryButton,
} from "@/components/marketing/marketing-ui";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalPage({
  title,
  intro,
  updated,
  sections,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-navy/10 bg-cream-soft">
        <Container className="py-16 sm:py-24">
          <SectionLabel index="12">Legal</SectionLabel>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.035em] text-navy sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-ink/65">{intro}</p>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-navy/40">
            Last updated: {updated}
          </p>
        </Container>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr] lg:gap-20">
            <aside>
              <div className="border-t border-navy/15 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Questions
                </p>
                <p className="mt-3 text-sm leading-6 text-ink/60">
                  If anything here is unclear, contact the team before applying
                  or making a decision.
                </p>
                <Link href="/contact" className={`${primaryButton} mt-5`}>
                  Contact us
                  <ArrowUpRight />
                </Link>
              </div>
            </aside>

            <div className="max-w-3xl">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="border-t border-navy/15 py-7 first:border-t-0 first:pt-0"
                >
                  <h2 className="font-display text-2xl tracking-[-0.02em] text-navy">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-4 text-sm leading-7 text-ink/65">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
              {children}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
