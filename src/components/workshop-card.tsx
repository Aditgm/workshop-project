import Link from "next/link";
import { formatDateTime, formatPrice } from "@/lib/format";
import { Badge, panelClass } from "@/components/ui";

type WorkshopCardProps = {
  workshop: {
    slug: string;
    title: string;
    summary: string;
    type: string;
    priceCents: number;
    currency: string;
    startsAt: Date;
    location: string | null;
    coverImageUrl: string | null;
  };
  index?: number;
};

const artworkThemes = [
  "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.9), transparent 20%), radial-gradient(circle at 76% 60%, rgba(139,92,246,0.9), transparent 46%), linear-gradient(145deg, #ddd6fe 0%, #6d28d9 36%, #111827 100%)",
  "radial-gradient(circle at 78% 20%, rgba(224,231,255,0.9), transparent 24%), radial-gradient(circle at 20% 82%, rgba(37,99,235,0.8), transparent 50%), linear-gradient(145deg, #c7d2fe 0%, #1d4ed8 38%, #05070d 100%)",
  "radial-gradient(circle at 24% 78%, rgba(255,255,255,0.7), transparent 22%), radial-gradient(circle at 78% 24%, rgba(244,114,182,0.75), transparent 42%), linear-gradient(145deg, #f5d0fe 0%, #9d174d 42%, #100810 100%)",
  "radial-gradient(circle at 50% 22%, rgba(255,255,255,0.85), transparent 18%), radial-gradient(circle at 18% 70%, rgba(45,212,191,0.65), transparent 44%), linear-gradient(145deg, #ccfbf1 0%, #0f766e 38%, #04100f 100%)",
];

export function WorkshopCard({ workshop, index = 0 }: WorkshopCardProps) {
  const isPrivate = workshop.type === "PRIVATE";
  const theme = artworkThemes[index % artworkThemes.length];
  const monogram = workshop.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <article
      className={`${panelClass} card-interactive group animate-enter overflow-hidden`}
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <Link href={`/workshops/${workshop.slug}`} className="flex h-full flex-col">
        <div className="relative h-56 overflow-hidden p-5">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none"
            style={
              workshop.coverImageUrl
                ? {
                    backgroundImage: `linear-gradient(to top, rgba(5,5,6,0.84), rgba(5,5,6,0.08)), url("${workshop.coverImageUrl}")`,
                  }
                : { backgroundImage: theme }
            }
            aria-hidden="true"
          />
          <div className="poster-art absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="cover-grid absolute inset-0 opacity-30" aria-hidden="true" />
          <div
            className="absolute -right-14 -top-16 size-56 rounded-full border border-white/15"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 left-12 size-52 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-7 right-2 select-none text-[7rem] font-semibold leading-none tracking-[-0.12em] text-white/10 transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] motion-reduce:transform-none"
            aria-hidden="true"
          >
            {monogram}
          </span>

          <div className="relative flex items-start justify-between gap-3">
            <Badge tone={isPrivate ? "amber" : "green"}>
              {isPrivate ? "Paid workshop" : "Public workshop"}
            </Badge>
            <span className="grid size-9 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 14.5l9-9m0 0H7m7.5 0V13" />
              </svg>
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <span className="glass-pill inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-white/85">
              <span className="size-1.5 shrink-0 rounded-full bg-white shadow-[0_0_9px_rgba(255,255,255,0.8)]" />
              <span className="truncate">{formatDateTime(workshop.startsAt)}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold leading-[1.15] tracking-[-0.035em] text-white transition-colors group-hover:text-violet-100">
              {workshop.title}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                isPrivate
                  ? "border-amber-300/20 bg-amber-300/[0.08] text-amber-100"
                  : "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-100"
              }`}
            >
              {formatPrice(workshop.priceCents, workshop.currency)}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
            {workshop.summary}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4 text-xs text-white/35">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="size-3.5 shrink-0"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span className="truncate">{workshop.location || "Online"}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-white/55 transition-colors group-hover:text-white">
              View session
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
