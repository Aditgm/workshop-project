"use client";

import { useFormStatus } from "react-dom";
import { primaryButton, Spinner } from "@/components/ui";

export function SubmitButton({
  children,
  pendingLabel = "Saving...",
  className = primaryButton,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
