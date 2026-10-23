import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { getSessionUser } from "@/lib/auth";
import { BrandMark } from "@/components/marketing/brand-mark";
import {
  Container,
  primaryButton,
} from "@/components/marketing/marketing-ui";

const primaryLinks = [
  { href: "/programs", label: "Programs" },
  { href: "/for-companies", label: "For Companies" },
  { href: "/resources", label: "Resources" },
];

const utilityLinks = [
  { href: "/rinassa-ai", label: "Rinassa AI" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export async function SiteHeader() {
  const user = await getSessionUser();
  const portalHref = user?.role === "ADMIN" ? "/admin" : "/login";
  const portalLabel = user?.role === "ADMIN" ? "Admin" : "Login";

  return (
    <>
      <div className="bg-navy text-cream/65">
        <Container className="flex min-h-9 items-center justify-between gap-6 py-2">
          <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] sm:block">
            Practical commercial education, advisory, and community.
          </p>
          <nav
            aria-label="Utility navigation"
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium uppercase tracking-[0.16em] sm:ml-auto"
          >
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-gold-soft"
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden="true" className="hidden h-3 w-px bg-cream/20 sm:block" />
            <Link
              href={portalHref}
              className="transition-colors hover:text-gold-soft"
            >
              {portalLabel}
            </Link>
            {user ? (
              <form action={logoutAction} className="contents">
                <button
                  type="submit"
                  className="uppercase tracking-[0.16em] transition-colors hover:text-gold-soft"
                >
                  Sign out
                </button>
              </form>
            ) : null}
          </nav>
        </Container>
      </div>

      <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/95 backdrop-blur">
        <Container className="relative flex h-[76px] items-center justify-between gap-8">
          <BrandMark />

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 lg:flex"
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-semibold uppercase tracking-[0.16em] text-navy/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/apply" className={`${primaryButton} hidden px-4 py-2.5 sm:inline-flex`}>
              Apply Now
              <span aria-hidden="true">&#8599;</span>
            </Link>

            <details className="group relative lg:hidden">
              <summary
                className="flex size-11 cursor-pointer list-none items-center justify-center border border-navy/20 text-navy transition-colors hover:border-navy/45 [&::-webkit-details-marker]:hidden"
                aria-label="Open navigation menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-5 group-open:hidden"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="hidden size-5 group-open:block"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                </svg>
              </summary>

              <nav
                aria-label="Mobile navigation"
                className="absolute right-0 top-[calc(100%+14px)] z-50 w-[min(22rem,calc(100vw-2.5rem))] border border-navy/15 bg-cream p-5 shadow-[0_24px_60px_rgba(10,35,56,0.18)]"
              >
                <div className="grid gap-1">
                  {primaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="border-b border-navy/10 py-3 font-display text-2xl text-navy transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/apply"
                    className={`${primaryButton} mt-4 w-full`}
                  >
                    Apply Now
                    <span aria-hidden="true">&#8599;</span>
                  </Link>
                </div>

                <div className="mt-5 grid gap-2 border-t border-navy/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy/60">
                  {utilityLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="py-1 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={portalHref}
                    className="py-1 transition-colors hover:text-gold"
                  >
                    {portalLabel}
                  </Link>
                  {user ? (
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="py-1 uppercase tracking-[0.16em] transition-colors hover:text-gold"
                      >
                        Sign out
                      </button>
                    </form>
                  ) : null}
                </div>
              </nav>
            </details>
          </div>
        </Container>
      </header>
    </>
  );
}
