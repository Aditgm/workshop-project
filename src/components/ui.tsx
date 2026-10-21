import type { ReactNode } from "react";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-[transform,translate,scale,background-color,border-color,color,box-shadow] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-[1.015] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 active:translate-y-px active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 motion-reduce:transform-none motion-reduce:transition-none";

export const primaryButton = `${buttonBase} border border-white bg-white px-5 py-2.5 text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_30px_rgba(0,0,0,0.35)] hover:bg-zinc-200`;

export const secondaryButton = `${buttonBase} border border-white/10 bg-white/[0.045] px-5 py-2.5 text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.075] hover:text-white`;

export const dangerButton = `${buttonBase} border border-rose-400/20 bg-rose-400/[0.07] px-3.5 py-2 text-rose-200 hover:border-rose-400/35 hover:bg-rose-400/[0.12]`;

export const subtleButton = `${buttonBase} px-3 py-2 text-white/55 hover:bg-white/[0.055] hover:text-white`;

export const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-white/25 hover:border-white/20 focus:border-violet-300/45 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-400/10";

export const labelClass = "mb-2 block text-sm font-medium text-white/65";

export const panelClass =
  "rounded-[25px] border border-white/10 bg-[#070708]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm";

export const eyebrowClass =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40";

export const displayTitleClass =
  "text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl";

export const sectionTitleClass =
  "text-balance text-3xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-4xl";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "green" | "amber" | "indigo" | "red";
}) {
  const tones = {
    slate: "bg-white/[0.055] text-white/65 ring-white/10",
    green: "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20",
    amber: "bg-amber-400/10 text-amber-200 ring-amber-300/20",
    indigo: "bg-violet-400/10 text-violet-200 ring-violet-300/20",
    red: "bg-rose-400/10 text-rose-200 ring-rose-300/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: ReactNode;
}) {
  const tones = {
    info: "border-violet-300/15 bg-violet-400/[0.07] text-violet-100",
    error: "border-rose-300/15 bg-rose-400/[0.07] text-rose-100",
    success: "border-emerald-300/15 bg-emerald-400/[0.07] text-emerald-100",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[25px] border border-dashed border-white/12 bg-white/[0.018] px-6 py-14 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
        <span className="size-2 rounded-full bg-violet-300/80 shadow-[0_0_16px_rgba(196,181,253,0.65)]" />
      </span>
      <h3 className="mt-4 text-base font-medium text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
