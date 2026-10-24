import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { CONTACT_TOPICS } from "@/lib/marketing-validation";
import { ContactForm } from "@/components/marketing/contact-form";
import {
  ArrowUpRight,
  Container,
  PageHero,
  SectionLabel,
  marketingSection,
  marketingSectionTitle,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Hunt n Farm about First Quota, company advisory, Revenue Lab, or Rinassa AI.",
};

function resolveTopic(value: string | string[] | undefined): string {
  const topic = Array.isArray(value) ? value[0] : value;
  return CONTACT_TOPICS.some((item) => item.value === topic) ? topic! : "general";
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string | string[] }>;
}) {
  const [content, params] = await Promise.all([getSiteContent(), searchParams]);
  const contact = content.contact;
  const hasDetails = Boolean(contact.email || contact.phone || contact.address);

  return (
    <>
      <PageHero
        index="09"
        eyebrow="Contact Us"
        title="Start a conversation."
        intro="Tell us what you are considering, what you are building, or what you need help with. We will follow up using the details you provide."
        aside={
          <div className="border-l border-gold/50 pl-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
              Direct details
            </p>
            <div className="mt-4 space-y-2 text-sm leading-6 text-navy">
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="block w-fit underline decoration-navy/20 underline-offset-4 hover:decoration-gold"
                >
                  {contact.email}
                </a>
              ) : null}
              {contact.phone ? <p>{contact.phone}</p> : null}
              {contact.address ? (
                <p className="whitespace-pre-line text-ink/65">{contact.address}</p>
              ) : null}
              {!hasDetails ? (
                <p className="text-sm leading-6 text-ink/60">
                  Direct contact details are being finalised. Use the form and
                  the team will get back to you.
                </p>
              ) : null}
              {content.consultancy.calendlyUrl ? (
                <div className="pt-4 border-t border-navy/15 mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Advisory Booking
                  </p>
                  <p className="mt-1 text-xs text-ink/70">
                    Need a direct 1-on-1 consultation?
                  </p>
                  <a
                    href={content.consultancy.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold transition-colors"
                  >
                    <span>Schedule on Calendly</span>
                    <ArrowUpRight />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        }
      />

      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <SectionLabel index="10">Send a message</SectionLabel>
              <h2 className={`${marketingSectionTitle} mt-6`}>
                We read every enquiry.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-ink/65">
                {contact.responseNote}
              </p>
              <div className="mt-8 border-t border-navy/15 pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Useful to include
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/65">
                  <li>What you are enquiring about</li>
                  <li>Your current context or role</li>
                  <li>Any timing or decision constraints</li>
                </ul>
              </div>
            </div>

            <div className="border border-navy/15 bg-cream-soft p-6 sm:p-8">
              <ContactForm defaultTopic={resolveTopic(params.topic)} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
