import { statusClasses, statusLabel } from "@/lib/submission-status";

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusClasses(status)}`}
    >
      {statusLabel(status)}
    </span>
  );
}
