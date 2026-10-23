import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminLoginForm } from "@/components/marketing/admin-login-form";
import {
  Container,
  SectionLabel,
} from "@/components/marketing/marketing-ui";

export const metadata: Metadata = {
  title: "Login",
  description: "Administrator sign-in for Hunt n Farm.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <section className="relative overflow-hidden bg-navy text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full border border-gold/15"
      />
      <Container className="relative grid min-h-[70vh] gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">
        <div>
          <SectionLabel index="11" tone="dark">
            Login
          </SectionLabel>
          <h1 className="mt-7 font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
            Site administration.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-6 text-cream/55">
            This area is for Hunt n Farm administrators. The learner portal is
            not part of Phase 1. If you need access, contact the site owner.
          </p>
          <div className="mt-8 border-t border-cream/15 pt-6 text-sm text-cream/50">
            <p>
              Looking for the programme?{" "}
              <Link
                href="/programs"
                className="font-semibold text-gold-soft underline decoration-gold/30 underline-offset-4 hover:text-cream"
              >
                Explore First Quota
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="border border-cream/15 bg-cream p-6 text-ink sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
            Administrator access
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.025em] text-navy">
            Sign in.
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Use the administrator account provided during handover.
          </p>
          <div className="mt-7">
            <AdminLoginForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
