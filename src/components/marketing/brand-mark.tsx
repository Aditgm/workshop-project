import Link from "next/link";

export function BrandMark({
  tone = "light",
  compact = false,
}: {
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Hunt n Farm home"
      className={`group inline-flex items-center gap-3 ${
        tone === "dark" ? "text-cream" : "text-navy"
      }`}
    >
      <span
        className={`relative grid size-10 shrink-0 place-items-center border text-[13px] font-semibold tracking-[-0.06em] transition-colors ${
          tone === "dark"
            ? "border-cream/35 group-hover:border-gold-soft"
            : "border-navy/30 group-hover:border-gold"
        }`}
      >
        <span className="font-display text-lg leading-none">H</span>
        <span className="absolute -right-[3px] -top-[3px] size-1.5 bg-gold" />
      </span>
      <span>
        <span className="block whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.2em]">
          Hunt n Farm
        </span>
        {compact ? null : (
          <span
            className={`mt-0.5 hidden whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.22em] sm:block ${
              tone === "dark" ? "text-cream/45" : "text-navy/45"
            }`}
          >
            Training · Advisory · Community
          </span>
        )}
      </span>
    </Link>
  );
}
