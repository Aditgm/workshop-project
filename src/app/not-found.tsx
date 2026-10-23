import Link from "next/link";
import { BrandMark } from "@/components/marketing/brand-mark";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-8">
        <BrandMark />
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-5 py-20 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold">
          404 · Off the map
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.035em] text-navy sm:text-6xl">
          This page is not in the field.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-ink/60">
          The page may have moved, or the link may be out of date. Start again
          from the homepage or explore the programmes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center border border-navy bg-navy px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-navy-deep"
          >
            Back home
          </Link>
          <Link
            href="/programs"
            className="inline-flex min-h-11 items-center justify-center border border-navy/20 px-5 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy/40"
          >
            Explore First Quota
          </Link>
        </div>
      </div>
    </div>
  );
}
