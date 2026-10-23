import Link from "next/link";
import type { ReactNode } from "react";
import type { ActionState } from "@/lib/action-state";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="border border-red-900/20 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900"
    >
      {message}
    </div>
  );
}

export function FormSuccess({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="border border-gold/45 bg-gold/[0.08] p-6 sm:p-8">
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center border border-gold/60 font-display text-xl text-gold"
      >
        &#10003;
      </span>
      <h2 className="mt-5 font-display text-3xl tracking-[-0.025em] text-navy">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/70">{message}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}

export function Honeypot({ id }: { id: string }) {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

export function FormState({ state }: { state: ActionState }) {
  if (!state?.error) return null;
  return <FormError message={state.error} />;
}

export function FormFootnote({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-5 text-ink/45">{children}</p>;
}

export function FormPrivacyLink() {
  return (
    <Link href="/legal/privacy" className="underline underline-offset-4 hover:text-navy">
      privacy policy
    </Link>
  );
}
