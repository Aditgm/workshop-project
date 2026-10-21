import type { Metadata } from "next";
import Link from "next/link";
import { ChangePasswordForm } from "@/components/account-form";
import {
  Badge,
  eyebrowClass,
  Notice,
  panelClass,
  secondaryButton,
} from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { initials } from "@/lib/format";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string | string[] }>;
}) {
  const user = await requireUser("/account");
  const params = await searchParams;
  const updated = Array.isArray(params.updated)
    ? params.updated[0]
    : params.updated;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="animate-enter flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={eyebrowClass}>Account settings</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
            Your <span className="text-gradient">account.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/40">
            Review your account details and keep your password up to date.
          </p>
        </div>
        <Link href="/dashboard" className={secondaryButton}>
          Back to dashboard
        </Link>
      </div>

      {updated === "1" ? (
        <div className="mt-7">
          <Notice tone="success">
            Password updated. Other sessions have been signed out.
          </Notice>
        </div>
      ) : null}

      <div className="mt-9 grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="space-y-4">
          <section className={`${panelClass} animate-enter relative overflow-hidden p-6`}>
            <div
              className="pointer-events-none absolute -right-14 -top-16 size-48 rounded-full bg-violet-500/[0.1] blur-3xl"
              aria-hidden="true"
            />
            <span className="relative grid size-16 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-violet-200 to-white text-lg font-semibold tracking-[-0.04em] text-zinc-950 shadow-[0_0_40px_rgba(196,181,253,0.18)]">
              {initials(user.name)}
            </span>
            <h2 className="mt-5 truncate text-xl font-medium tracking-[-0.035em] text-white">
              {user.name}
            </h2>
            <p className="mt-1 truncate text-sm text-white/35">{user.email}</p>
            <div className="mt-4">
              <Badge tone={user.role === "ADMIN" ? "amber" : "slate"}>
                {user.role === "ADMIN" ? "Administrator" : "Member"}
              </Badge>
            </div>
          </section>

          <section className={`${panelClass} animate-enter p-6`} style={{ animationDelay: "80ms" }}>
            <h2 className="text-sm font-medium text-white">Account details</h2>
            <dl className="mt-5 space-y-4 border-t border-white/[0.07] pt-5 text-sm">
              <div>
                <dt className={eyebrowClass}>Name</dt>
                <dd className="mt-1.5 font-medium text-white/75">{user.name}</dd>
              </div>
              <div>
                <dt className={eyebrowClass}>Email</dt>
                <dd className="mt-1.5 break-all font-medium text-white/75">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className={eyebrowClass}>Access level</dt>
                <dd className="mt-1.5 text-white/75">
                  {user.role === "ADMIN" ? "Administrator" : "Member"}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <section
          className={`${panelClass} animate-enter relative overflow-hidden p-6 sm:p-8`}
          style={{ animationDelay: "150ms" }}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-violet-500/[0.08] blur-[80px]"
            aria-hidden="true"
          />
          <div className="relative">
            <p className={eyebrowClass}>Security</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Change password
            </h2>
            <p className="mb-6 mt-2 text-sm leading-6 text-white/35">
              Enter your current password, then choose a new one with at least
              10 characters.
            </p>
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
