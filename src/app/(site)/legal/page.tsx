import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Container,
  PageHero,
  marketingSection,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Legal",
  description: "Hunt n Farm legal and policy pages.",
};

const pages = [
  { href: "/legal/privacy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Website terms" },
  { href: "/legal/refund-policy", label: "Refund policy" },
  { href: "/legal/placement-terms", label: "Placement terms" },
];

export default function LegalIndexPage() {
  return (
    <>
      <PageHero
        index="12"
        eyebrow="Legal"
        title="The clear print."
        intro="The policies that apply to the Hunt n Farm website, enquiries, applications, and placement support."
      />
      <section className={`${marketingSection} bg-cream`}>
        <Container>
          <div className="grid gap-px border border-navy/15 bg-navy/15 sm:grid-cols-2">
            {pages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center justify-between gap-4 bg-cream p-6 transition-colors hover:bg-cream-soft sm:p-8"
              >
                <span className="font-display text-3xl tracking-[-0.025em] text-navy">
                  {page.label}
                </span>
                <span aria-hidden="true" className="text-gold">
                  <ArrowUpRight />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
