import Link from "next/link";
import { primaryButton } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center sm:px-8">
      <span className="grid size-12 place-items-center rounded-full border border-violet-300/20 bg-violet-400/[0.07] text-violet-200">
        <span className="text-sm font-medium" aria-hidden="true">
          404
        </span>
      </span>
      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-200/60">
        Page not found
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
        This page is off the map.
      </h1>
      <p className="mt-4 text-sm leading-6 text-white/40">
        The page you are looking for may have moved, or you may not have access
        to it.
      </p>
      <Link href="/" className={`${primaryButton} mt-7`}>
        Back to workshops
      </Link>
    </div>
  );
}
