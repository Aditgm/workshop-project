import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLink,
  ArrowUpRight,
  Callout,
  Container,
  SectionLabel,
  marketingBody,
  marketingDisplay,
  marketingSection,
  marketingSectionTitle,
  primaryButtonOnDark,
  secondaryButtonOnDark,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Rinassa AI",
  description:
    "Rinassa AI is part of the Hunt n Farm family. This is a Phase 1 presence while the dedicated product experience is developed.",
};

export default function RinassaPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-52 size-[42rem] rounded-full border border-gold/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-10 size-[24rem] rounded-full border border-gold/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(247,242,232,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(247,242,232,0.07)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        />
        <Container className="relative py-20 sm:py-28 lg:py-32">
          <SectionLabel index="07" tone="dark">
            Rinassa AI
          </SectionLabel>
          <h1 className={`${marketingDisplay} mt-7 max-w-4xl text-cream`}>
            A new product
            <span className="block text-cream/40">in the farm.</span>
          </h1>
          <p className={`${marketingBody} mt-8 max-w-2xl text-cream/60`}>
            Rinassa AI is part of the Hunt n Farm family. The dedicated product
            experience is being developed separately; this Phase 1 page exists
            to make the relationship clear and give interested people a way to
            get in touch.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact?topic=rinassa-ai" className={primaryButtonOnDark}>
              Contact us about Rinassa
              <ArrowUpRight />
            </Link>
            <Link href="/about" className={secondaryButtonOnDark}>
              About Hunt n Farm
            </Link>
          </div>
        </Container>
      </section>

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel index="08">What this is</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                A clear presence, without invented detail.
              </h2>
            </div>
            <div>
              <p className={`${marketingBody} max-w-2xl`}>
                This page does not claim a product capability that has not been
                agreed or launched. It is a simple Phase 1 presence for Rinassa
                AI, with a direct route to the team for anyone who wants to
                understand what comes next.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Callout title="Part of Hunt n Farm">
                  <p>
                    Rinassa AI belongs to the same family as First Quota,
                    Revenue Lab, and our advisory work.
                  </p>
                </Callout>
                <Callout title="In development">
                  <p>
                    The dedicated product site and experience are future scope.
                    This page will evolve when that work is ready.
                  </p>
                </Callout>
              </div>
              <ArrowLink href="/contact?topic=rinassa-ai" className="mt-8">
                Ask about Rinassa AI
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
