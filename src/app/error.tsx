"use client";

import Link from "next/link";
import { BrandMark } from "@/components/marketing/brand-mark";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-8">
        <BrandMark />
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-5 py-20 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold">
          Something went wrong
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.035em] text-navy sm:text-6xl">
          We could not load this page.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-ink/60">
          Try again in a moment. If the problem continues, use the contact page
          and the team will follow up.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center border border-navy bg-navy px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-navy-deep"
          >
            Try again
          </button>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center border border-navy/20 px-5 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy/40"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
