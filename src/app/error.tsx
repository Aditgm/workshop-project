"use client";

import Link from "next/link";
import { primaryButton } from "@/components/ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center sm:px-8">
      <span className="grid size-12 place-items-center rounded-full border border-rose-300/20 bg-rose-400/[0.07] text-rose-200">
        <span className="text-lg" aria-hidden="true">
          !
        </span>
      </span>
      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-rose-200/60">
        Something went wrong
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
        We could not load this page.
      </h1>
      <p className="mt-4 text-sm leading-6 text-white/40">
        Try again in a moment. If the problem continues, contact the organizer.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        <button type="button" onClick={reset} className={primaryButton}>
          Try again
        </button>
        <Link href="/" className="text-sm font-medium text-white/40 hover:text-white">
          Back to workshops
        </Link>
      </div>
    </div>
  );
}
