import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth-forms";
import { getSessionUser, safeRedirectPath } from "@/lib/auth";
import { eyebrowClass, panelClass } from "@/components/ui";

export const metadata: Metadata = {
  title: "Create account",
};

const benefits = [
  "Join free community workshops",
  "Unlock paid small-group sessions",
  "Keep every update in one dashboard",
];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = safeRedirectPath(nextValue, "/dashboard");

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
      <div className="animate-enter max-w-lg">
        <p className={eyebrowClass}>Free to join</p>
        <h1 className="mt-4 text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl">
          Start
          <span className="text-gradient block">learning.</span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-white/40 sm:text-base">
          Create one account for free workshops, focused paid sessions, and
          every organizer update that follows.
        </p>

        <ul className="mt-8 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-sm text-white/50">
              <span className="grid size-6 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                <span className="size-1.5 rounded-full bg-emerald-300/80" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`${panelClass} animate-enter relative overflow-hidden p-6 sm:p-8`}
        style={{ animationDelay: "80ms" }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-emerald-400/[0.08] blur-[80px]"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Create your account</p>
              <p className="mt-1 text-xs text-white/30">Attendee accounts are free forever.</p>
            </div>
            <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.035]">
              <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.7)]" />
            </span>
          </div>
          <RegisterForm next={next} />
        </div>
      </div>
    </div>
  );
}
