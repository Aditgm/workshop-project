import type { ReactNode } from "react";

export const adminPanel =
  "border border-cream/10 bg-cream/[0.035] shadow-[inset_0_1px_0_rgba(247,242,232,0.03)]";

export const adminLabel =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/45";

export const adminInput =
  "w-full rounded-[2px] border border-cream/15 bg-cream/[0.045] px-3.5 py-2.5 text-sm text-cream outline-none transition-[border-color,background-color,box-shadow] placeholder:text-cream/25 hover:border-cream/25 focus:border-gold/55 focus:bg-cream/[0.06] focus:ring-4 focus:ring-gold/10";

export const adminTextarea = `${adminInput} min-h-32 resize-y leading-6`;

export const adminPrimaryButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[2px] border border-gold bg-gold px-4 py-2.5 text-sm font-semibold text-navy-deep transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-gold-soft hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream active:translate-y-0 motion-reduce:transform-none";

export const adminSecondaryButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[2px] border border-cream/20 px-4 py-2.5 text-sm font-semibold text-cream/70 transition-colors hover:border-cream/40 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function AdminPageHeader({
  eyebrow = "Admin",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-soft">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[0.98] tracking-[-0.035em] text-cream sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-cream/45">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  delay = 0,
}: {
  label: string;
  value: string;
  hint?: string;
  delay?: number;
}) {
  return (
    <div
      className={`${adminPanel} card-interactive relative overflow-hidden p-5`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-12 size-28 rounded-full bg-gold/[0.06] blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/35">
          {label}
        </p>
        <span className="mt-1 size-1.5 shrink-0 bg-gold" aria-hidden="true" />
      </div>
      <p className="relative mt-5 font-display text-4xl tabular-nums tracking-[-0.03em] text-cream">
        {value}
      </p>
      {hint ? <p className="relative mt-2 text-xs text-cream/35">{hint}</p> : null}
    </div>
  );
}

export function AdminEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-cream/15 px-6 py-14 text-center">
      <span className="mx-auto grid size-10 place-items-center border border-gold/30 font-display text-lg text-gold">
        &#9679;
      </span>
      <h2 className="mt-4 font-display text-2xl text-cream">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cream/40">
        {description}
      </p>
    </div>
  );
}
