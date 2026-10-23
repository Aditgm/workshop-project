import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { RevenueLabForm } from "@/components/marketing/revenue-lab-form";
import {
  Container,
  Fact,
  PageHero,
  SectionLabel,
  marketingSection,
  marketingSectionTitle,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Revenue Lab | Free weekly workshop and community",
  description:
    "Revenue Lab is a free weekly workshop and community for people working in or moving into revenue roles.",
};

export default async function RevenueLabPage() {
  const content = await getSiteContent();
  const lab = content.revenueLab;

  return (
    <>
      <PageHero
        index="06"
        eyebrow="Revenue Lab"
        title="Practice the craft, together."
        intro={lab.summary}
        aside={
          <dl>
            <Fact label="Format" value={lab.format} />
            <Fact label="Rhythm" value={lab.schedule} />
            <Fact label="Cost" value="Free" />
          </dl>
        }
      />

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <SectionLabel index="07">What to expect</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                A working session, not a performance.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-6 text-ink/65">
                Revenue Lab is built for the practical questions that come up in
                commercial work. Each session is a chance to work through a
                topic, compare approaches, and leave with something useful to
                try.
              </p>

              <div className="mt-10 space-y-6 border-t border-navy/15 pt-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                    Weekly workshop
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/65">
                    A focused session on a part of the commercial craft, from
                    research and outbound to discovery and pipeline.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                    Open community
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/65">
                    A place to compare notes with other people doing the work.
                    No gatekeeping, no theatre.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                    Session details
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/65">
                    Register below and the team will follow up with the latest
                    session details.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-navy/15 bg-cream-soft p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                Join Revenue Lab
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.025em] text-navy">
                Save your place.
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/60">
                Registration is free. Add your details and we will share the
                next session details by email.
              </p>
              <div className="mt-7">
                <RevenueLabForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
