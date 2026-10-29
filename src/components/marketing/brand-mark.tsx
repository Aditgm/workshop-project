import Link from "next/link";
import { HuntNFarmLogo } from "@/components/brand/huntnfarm-logo";
import { HuntNFarmEmblem } from "@/components/brand/huntnfarm-emblem";

export { HuntNFarmLogo, HuntNFarmEmblem };

export function BrandMark({
  tone = "light",
  compact = false,
  className = "",
}: {
  tone?: "light" | "dark";
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Hunt n Farm home"
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-95 ${className} ${
        tone === "dark" ? "text-cream" : "text-navy"
      }`}
    >
      {compact ? (
        <span className="inline-flex items-center gap-2.5">
          <HuntNFarmEmblem
            className={`h-7 sm:h-8 w-auto shrink-0 transition-transform duration-200 group-hover:scale-105 ${
              tone === "dark"
                ? "drop-shadow-[0_1px_6px_rgba(225,187,115,0.25)]"
                : "drop-shadow-[0_1px_2px_rgba(10,35,56,0.18)]"
            }`}
          />
          <span className="font-semibold uppercase tracking-[0.18em] text-[12px] sm:text-[13px] whitespace-nowrap">
            Hunt n Farm
          </span>
        </span>
      ) : (
        <span className="relative inline-flex items-center py-0.5">
          <HuntNFarmLogo
            className={`h-10 sm:h-12 w-auto shrink-0 transition-transform duration-200 group-hover:scale-[1.02] ${
              tone === "dark"
                ? "drop-shadow-[0_2px_8px_rgba(225,187,115,0.2)]"
                : "drop-shadow-[0_1px_2px_rgba(10,35,56,0.16)]"
            }`}
          />
        </span>
      )}
    </Link>
  );
}
