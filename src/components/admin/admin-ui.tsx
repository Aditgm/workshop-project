import type { ReactNode } from "react";
import { eyebrowClass, panelClass } from "@/components/ui";

export function AdminPageHeader({
  eyebrow = "Admin control",
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
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className={eyebrowClass}>{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
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
  accent,
  delay = 0,
}: {
  label: string;
  value: string;
  accent: string;
  delay?: number;
}) {
  return (
    <div
      className={`${panelClass} card-interactive animate-enter relative overflow-hidden p-4 sm:p-5`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-12 size-28 rounded-full bg-white/[0.035] blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase leading-tight tracking-[0.14em] text-white/30 sm:text-[11px]">
          {label}
        </p>
        <span
          className={`mt-1 size-1.5 shrink-0 rounded-full shadow-[0_0_10px_currentColor] ${accent}`}
          aria-hidden="true"
        />
      </div>
      <p className="relative mt-4 text-xl font-semibold tabular-nums tracking-[-0.045em] text-white sm:text-2xl">
        {value}
      </p>
    </div>
  );
}
