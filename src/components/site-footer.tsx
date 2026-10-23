import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getSiteContent } from "@/lib/site-content";
import { BrandMark } from "@/components/marketing/brand-mark";
import {
  ArrowUpRight,
  Container,
  marketingBody,
} from "@/components/marketing/marketing-ui";

const exploreLinks = [
  { href: "/programs", label: "First Quota" },
  { href: "/for-companies", label: "For Companies" },
  { href: "/resources", label: "Resources" },
  { href: "/revenue-lab", label: "Revenue Lab" },
  { href: "/placement", label: "Placement" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/rinassa-ai", label: "Rinassa AI" },
  { href: "/contact", label: "Contact Us" },
  { href: "/apply", label: "Apply Now" },
];

const legalLinks = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/refund-policy", label: "Refund policy" },
  { href: "/legal/placement-terms", label: "Placement terms" },
];

export async function SiteFooter() {
  const [user, content] = await Promise.all([getSessionUser(), getSiteContent()]);
  const contactParts = [content.contact.email, content.contact.phone].filter(Boolean);

  return (
    <footer className="relative overflow-hidden bg-navy text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-40 size-[30rem] rounded-full border border-gold/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-24 size-[18rem] rounded-full border border-gold/10"
      />

      <Container className="relative pb-8 pt-16 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_0.55fr_0.55fr_0.65fr] lg:gap-8">
          <div>
            <BrandMark tone="dark" />
            <p className="mt-10 max-w-lg font-display text-4xl leading-[1.02] tracking-[-0.03em] text-cream sm:text-5xl">
              Build the capability
              <span className="block text-cream/45">behind the number.</span>
            </p>
            <p className={`${marketingBody} mt-6 max-w-sm text-cream/55`}>
              Practical commercial education, advisory, and a community for
              people doing the work.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/35">
              Explore
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-cream/65">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit transition-colors hover:text-gold-soft"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/35">
              Company
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-cream/65">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit transition-colors hover:text-gold-soft"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/35">
              Contact
            </p>
            <div className="mt-5 space-y-3 text-sm leading-6 text-cream/65">
              {content.contact.email ? (
                <a
                  href={`mailto:${content.contact.email}`}
                  className="block w-fit transition-colors hover:text-gold-soft"
                >
                  {content.contact.email}
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="block w-fit transition-colors hover:text-gold-soft"
                >
                  Contact the team
                </Link>
              )}
              {content.contact.phone ? <p>{content.contact.phone}</p> : null}
              {content.contact.address ? (
                <p className="whitespace-pre-line">{content.contact.address}</p>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-soft transition-colors hover:text-cream"
              >
                Start a conversation
                <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-cream/15 pt-6">
          <div className="flex flex-col gap-5 text-[11px] text-cream/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} Hunt n Farm. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-cream/70"
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === "ADMIN" ? (
                <Link href="/admin" className="transition-colors hover:text-cream/70">
                  Admin
                </Link>
              ) : null}
            </div>
          </div>
          {contactParts.length ? (
            <p className="mt-3 text-[10px] text-cream/25">
              {contactParts.join("  ·  ")}
            </p>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
