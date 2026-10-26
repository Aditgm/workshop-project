import Link from "next/link";
import type { ReactNode } from "react";

export const marketingContainer =
  "mx-auto w-full max-w-[1280px] px-4 sm:px-8";

export const marketingSection = "py-14 sm:py-24 lg:py-28";

export const marketingEyebrow =
  "text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-gold";

export const marketingDisplay =
  "font-display text-balance text-4xl leading-[1.04] tracking-[-0.035em] text-navy sm:text-6xl lg:text-7xl";

export const marketingSectionTitle =
  "font-display text-balance text-3xl leading-[1.06] tracking-[-0.03em] text-navy sm:text-5xl";

export const marketingBody = "text-sm sm:text-base leading-relaxed sm:leading-7 text-ink/70 sm:text-lg sm:leading-8";

export const primaryButton =
  "inline-flex min-h-12 sm:min-h-11 items-center justify-center gap-3 rounded-[2px] border border-navy bg-navy px-5 py-3 text-sm font-semibold tracking-[0.01em] text-cream transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-navy-deep hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.98] motion-reduce:transform-none select-none";

export const primaryButtonOnDark =
  "inline-flex min-h-12 sm:min-h-11 items-center justify-center gap-3 rounded-[2px] border border-gold bg-gold px-5 py-3 text-sm font-semibold tracking-[0.01em] text-navy-deep transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-gold-soft hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream active:scale-[0.98] motion-reduce:transform-none select-none";

export const secondaryButton =
  "inline-flex min-h-12 sm:min-h-11 items-center justify-center gap-3 rounded-[2px] border border-navy/25 bg-transparent px-5 py-3 text-sm font-semibold tracking-[0.01em] text-navy transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-navy/50 hover:bg-navy/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.98] motion-reduce:transform-none select-none";

export const secondaryButtonOnDark =
  "inline-flex min-h-12 sm:min-h-11 items-center justify-center gap-3 rounded-[2px] border border-cream/25 bg-transparent px-5 py-3 text-sm font-semibold tracking-[0.01em] text-cream transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-cream/55 hover:bg-cream/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.98] motion-reduce:transform-none select-none";

export const fieldLabel = "mb-2 block text-sm font-semibold text-navy";

export const fieldInput =
  "w-full rounded-[2px] border border-navy/20 bg-white/55 px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow,background-color] placeholder:text-ink/35 hover:border-navy/35 focus:border-navy focus:bg-white focus:ring-4 focus:ring-gold/15";

export const fieldTextarea =
  "min-h-32 w-full resize-y rounded-[2px] border border-navy/20 bg-white/55 px-4 py-3 text-sm leading-6 text-ink outline-none transition-[border-color,box-shadow,background-color] placeholder:text-ink/35 hover:border-navy/35 focus:border-navy focus:bg-white focus:ring-4 focus:ring-gold/15";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${marketingContainer} ${className}`}>{children}</div>;
}

export function SectionLabel({
  index,
  children,
  tone = "light",
}: {
  index?: string;
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] ${
        tone === "dark" ? "text-gold-soft" : "text-gold"
      }`}
    >
      {index ? (
        <span className={tone === "dark" ? "text-cream/35" : "text-navy/35"}>
          {index}
        </span>
      ) : null}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function ArrowLink({
  href,
  children,
  tone = "light",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
        tone === "dark"
          ? "text-cream hover:text-gold-soft"
          : "text-navy hover:text-gold"
      } ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
      >
        &#8594;
      </span>
    </Link>
  );
}

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      &#8599;
    </span>
  );
}

export function Rule({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full ${tone === "dark" ? "bg-cream/15" : "bg-navy/15"}`}
    />
  );
}

export function PageHero({
  index,
  eyebrow,
  title,
  intro,
  children,
  aside,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy/10 bg-cream">
      <div className="absolute right-0 top-0 hidden h-full w-[38%] border-l border-navy/10 bg-cream-soft lg:block">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(10,35,56,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(10,35,56,0.055)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
      </div>
      <Container className="relative py-16 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <SectionLabel index={index}>{eyebrow}</SectionLabel>
            <h1 className={`${marketingDisplay} mt-6 max-w-3xl`}>{title}</h1>
            <p className={`${marketingBody} mt-7 max-w-2xl`}>{intro}</p>
            {children ? <div className="mt-9">{children}</div> : null}
          </div>
          {aside ? <div className="lg:pb-2">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}

export function Fact({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`border-t py-4 ${
        tone === "dark" ? "border-cream/15" : "border-navy/15"
      }`}
    >
      <dt
        className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
          tone === "dark" ? "text-cream/40" : "text-navy/45"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`mt-2 text-sm leading-6 ${
          tone === "dark" ? "text-cream" : "text-navy"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function NumberedRow({
  index,
  title,
  description,
  tone = "light",
}: {
  index: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`grid gap-3 border-t py-6 sm:grid-cols-[64px_1fr] ${
        tone === "dark" ? "border-cream/15" : "border-navy/15"
      }`}
    >
      <span
        className={`font-display text-lg ${
          tone === "dark" ? "text-gold-soft" : "text-gold"
        }`}
      >
        {index}
      </span>
      <div>
        <h3
          className={`font-display text-2xl tracking-[-0.02em] ${
            tone === "dark" ? "text-cream" : "text-navy"
          }`}
        >
          {title}
        </h3>
        {description ? (
          <p
            className={`mt-2 max-w-2xl text-sm leading-6 ${
              tone === "dark" ? "text-cream/60" : "text-ink/65"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Callout({
  title,
  children,
  tone = "cream",
}: {
  title: string;
  children: ReactNode;
  tone?: "cream" | "navy";
}) {
  return (
    <div
      className={`border p-6 ${
        tone === "navy"
          ? "border-cream/20 bg-cream/[0.05] text-cream"
          : "border-gold/40 bg-gold/[0.07] text-navy"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
          tone === "navy" ? "text-gold-soft" : "text-gold"
        }`}
      >
        {title}
      </p>
      <div
        className={`mt-3 text-sm leading-6 ${
          tone === "navy" ? "text-cream/75" : "text-ink/75"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
