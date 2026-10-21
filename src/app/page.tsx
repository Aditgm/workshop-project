import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { WorkshopCard } from "@/components/workshop-card";
import {
  Badge,
  EmptyState,
  eyebrowClass,
  primaryButton,
  secondaryButton,
  sectionTitleClass,
} from "@/components/ui";
import { formatDateTime, formatPrice } from "@/lib/format";

const formats = [
  {
    step: "01",
    title: "Browse",
    description: "Find a free community session or a focused paid workshop.",
  },
  {
    step: "02",
    title: "Enroll",
    description: "Join instantly or complete a secure checkout in a few clicks.",
  },
  {
    step: "03",
    title: "Unlock",
    description: "Your access link is revealed only when you are authorized.",
  },
  {
    step: "04",
    title: "Show up",
    description: "Keep every session, update, and meeting link in your dashboard.",
  },
];

export default async function HomePage() {
  const [user, workshops] = await Promise.all([
    getSessionUser(),
    db.workshop.findMany({
      where: { published: true },
      orderBy: { startsAt: "asc" },
      select: {
        slug: true,
        title: true,
        summary: true,
        type: true,
        priceCents: true,
        currency: true,
        startsAt: true,
        location: true,
        coverImageUrl: true,
      },
    }),
  ]);

  const publicWorkshops = workshops.filter(
    (workshop) => workshop.type === "PUBLIC",
  );
  const privateWorkshops = workshops.filter(
    (workshop) => workshop.type === "PRIVATE",
  );
  const featured = workshops[0];
  const featuredMonogram = featured
    ? featured.title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "WH";

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto max-w-[1280px] px-5 pb-8 pt-16 sm:px-8 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-enter inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-[11px] font-medium tracking-[0.04em] text-white/60 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
            Live community learning
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <span className="text-white/35">Workshops for every ambition</span>
          </div>

          <h1
            className="animate-enter mt-7 text-balance text-[clamp(3rem,7vw,5.7rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-white"
            style={{ animationDelay: "70ms" }}
          >
            Workshops worth
            <span className="text-gradient block">showing up for.</span>
          </h1>

          <p
            className="animate-enter mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-white/45 sm:text-lg sm:leading-8"
            style={{ animationDelay: "130ms" }}
          >
            Free community sessions and focused small-group deep dives. Clear
            details, secure access, and every update in one calm place.
          </p>

          <div
            className="animate-enter mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link href="#workshops" className={`${primaryButton} px-6 py-3 text-[15px]`}>
              Explore workshops
              <span className="grid size-6 place-items-center rounded-full bg-zinc-950 text-[10px] text-white">
                <span aria-hidden="true">&#8595;</span>
              </span>
            </Link>
            <Link
              href={user ? "/dashboard" : "/register"}
              className={`${secondaryButton} px-6 py-3 text-[15px]`}
            >
              {user ? "Open your dashboard" : "Create a free account"}
            </Link>
          </div>

          <ul
            className="animate-enter mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium text-white/30"
            style={{ animationDelay: "230ms" }}
          >
            <li className="inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-white/45" />
              Free sessions available
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-white/45" />
              Secure Stripe checkout
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="size-1 rounded-full bg-white/45" />
              In-app updates
            </li>
          </ul>
        </div>

        <div className="stagger-enter mx-auto mt-14 grid max-w-6xl auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-[0.88fr_1.5fr_0.88fr]">
          <div className="glass-panel flex flex-col justify-between rounded-[25px] p-5 md:col-start-1 md:row-start-1">
            <span className="grid size-8 place-items-center rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200">
              <span className="size-2 rounded-full bg-emerald-300" />
            </span>
            <div>
              <p className="text-4xl font-semibold tracking-[-0.055em] text-white">
                {publicWorkshops.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-white/35">
                free community {publicWorkshops.length === 1 ? "session" : "sessions"}
              </p>
            </div>
          </div>

          {featured ? (
            <Link
              href={`/workshops/${featured.slug}`}
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-[25px] border border-white/10 bg-[#0a0912] shadow-[0_30px_90px_rgba(0,0,0,0.4)] md:col-span-1 md:col-start-2 md:row-span-2 md:row-start-1"
            >
              {featured.coverImageUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(4,3,8,0.96) 4%, rgba(4,3,8,0.24) 58%, rgba(4,3,8,0.06)), url("${featured.coverImageUrl}")`,
                  }}
                  aria-hidden="true"
                />
              ) : (
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none"
                  style={{
                    background:
                      "radial-gradient(circle at 66% 28%, rgba(196,181,253,0.95), transparent 17%), radial-gradient(circle at 32% 72%, rgba(76,29,149,0.9), transparent 44%), radial-gradient(circle at 82% 86%, rgba(14,165,233,0.4), transparent 42%), linear-gradient(145deg, #d8d0ff 0%, #6d28d9 24%, #191033 55%, #050508 100%)",
                  }}
                  aria-hidden="true"
                />
              )}
              <div className="poster-art absolute inset-0 opacity-40" aria-hidden="true" />
              <div className="cover-grid absolute inset-0 opacity-20" aria-hidden="true" />
              <span
                className="absolute -bottom-10 right-2 select-none text-[11rem] font-semibold leading-none tracking-[-0.14em] text-white/[0.08] transition-transform duration-700 group-hover:-translate-y-2 motion-reduce:transform-none sm:text-[14rem]"
                aria-hidden="true"
              >
                {featuredMonogram}
              </span>

              <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-white">
                    <span className="size-1.5 rounded-full bg-violet-200 shadow-[0_0_10px_rgba(196,181,253,0.9)]" />
                    Featured workshop
                  </span>
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

                <div className="max-w-md">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge tone={featured.type === "PRIVATE" ? "amber" : "green"}>
                      {featured.type === "PRIVATE" ? "Paid" : "Free"}
                    </Badge>
                    <span className="text-[11px] text-white/55">
                      {formatDateTime(featured.startsAt)}
                    </span>
                  </div>
                  <h2 className="text-3xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-4xl">
                    {featured.title}
                  </h2>
                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
                    <span className="text-sm text-white/55">
                      {featured.location || "Online"}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {formatPrice(featured.priceCents, featured.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/register"
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-[25px] border border-white/10 bg-gradient-to-br from-violet-300 via-violet-700 to-black p-6 md:col-span-1 md:col-start-2 md:row-span-2 md:row-start-1"
            >
              <div className="cover-grid absolute inset-0 opacity-20" aria-hidden="true" />
              <div className="relative flex h-full flex-col justify-end">
                <h2 className="text-4xl font-semibold tracking-[-0.055em] text-white">
                  The next session is coming.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
                  Create an account and be ready when the next workshop is announced.
                </p>
              </div>
            </Link>
          )}

          <div className="glass-panel flex flex-col justify-between rounded-[25px] p-5 md:col-start-1 md:row-start-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">
              Premium
            </span>
            <div>
              <p className="text-4xl font-semibold tracking-[-0.055em] text-white">
                {privateWorkshops.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-white/35">
                small-group {privateWorkshops.length === 1 ? "session" : "sessions"}
              </p>
            </div>
          </div>

          <Link
            href="#workshops"
            className="glass-panel card-interactive group flex flex-col justify-between rounded-[25px] p-5 md:col-start-3 md:row-start-1"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">
              Catalogue
            </span>
            <div className="flex items-end justify-between gap-3">
              <span className="text-lg font-medium leading-tight tracking-[-0.03em] text-white">
                See all
                <br />
                workshops
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-white text-zinc-950 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none">
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
          </Link>

          <div className="relative overflow-hidden rounded-[25px] border border-white/10 bg-[#08080a] p-5 md:col-start-3 md:row-start-2">
            <div
              className="absolute -right-12 -top-14 size-40 rounded-full bg-violet-500/20 blur-3xl"
              aria-hidden="true"
            />
            <span className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-violet-200">
              <span className="size-2 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(196,181,253,0.8)]" />
            </span>
            <p className="mt-5 text-sm font-medium leading-5 text-white/80">
              Secure access,
              <br />
              every time.
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-white/30">
              Private links stay protected.
            </p>
          </div>
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className={eyebrowClass}>How it works</p>
          <h2 className={`${sectionTitleClass} mt-4`}>A simpler way to learn.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40 sm:text-base sm:leading-7">
            From discovery to the meeting room, every step is designed to get
            you into the right session without the usual friction.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[34px] border border-white/10 bg-[#050505]/90 px-4 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-8 sm:py-14">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/[0.07] blur-[100px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-10 top-[43%] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block"
            aria-hidden="true"
          />

          <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {formats.map((format, index) => (
              <div
                key={format.step}
                className="animate-enter rounded-[22px] border border-white/10 bg-white/[0.028] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[border-color,background-color] duration-300 hover:border-white/20 hover:bg-white/[0.045]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-[0.18em] text-white/25">
                    {format.step}
                  </span>
                  <span
                    className={`size-1.5 rounded-full ${
                      index === 0
                        ? "bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]"
                        : "bg-white/20"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-10 text-lg font-medium tracking-[-0.03em] text-white">
                  {format.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  {format.description}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mx-auto mt-10 flex items-center justify-center sm:mt-12">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0b0b0d] py-2.5 pl-3 pr-5 shadow-[0_14px_50px_rgba(0,0,0,0.4)]">
              <span className="grid size-7 place-items-center rounded-full bg-violet-300 text-zinc-950">
                <span className="text-xs" aria-hidden="true">
                  &#10022;
                </span>
              </span>
              <span className="text-sm font-medium text-white">Your next session</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="workshops"
        className="scroll-reveal mx-auto max-w-[1280px] scroll-mt-32 px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrowClass}>Workshop catalogue</p>
          <h2 className={`${sectionTitleClass} mt-4`}>Find your next session.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40 sm:text-base sm:leading-7">
            Choose a free community workshop or go deeper with a small-group
            paid session. Every listing includes the details you need to decide.
          </p>
        </div>

        <div className="mt-14 space-y-16">
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_9px_rgba(110,231,183,0.75)]" />
                  <p className={eyebrowClass}>Public</p>
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Free community workshops
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="green">
                  {publicWorkshops.length}{" "}
                  {publicWorkshops.length === 1 ? "session" : "sessions"}
                </Badge>
                <span className="hidden text-xs text-white/30 sm:inline">
                  Sign in to reveal the access link
                </span>
              </div>
            </div>

            {publicWorkshops.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publicWorkshops.map((workshop, index) => (
                  <WorkshopCard
                    key={workshop.slug}
                    workshop={workshop}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title="No public workshops yet"
                  description="New free sessions will appear here and trigger a notification when they are published."
                />
              </div>
            )}
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_9px_rgba(252,211,77,0.65)]" />
                  <p className={eyebrowClass}>Premium</p>
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Focused, paid workshops
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="amber">
                  {privateWorkshops.length}{" "}
                  {privateWorkshops.length === 1 ? "session" : "sessions"}
                </Badge>
                <span className="hidden text-xs text-white/30 sm:inline">
                  Small groups. Secure checkout.
                </span>
              </div>
            </div>

            {privateWorkshops.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {privateWorkshops.map((workshop, index) => (
                  <WorkshopCard
                    key={workshop.slug}
                    workshop={workshop}
                    index={index + publicWorkshops.length}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title="No premium workshops scheduled"
                  description="Paid workshops will show up here with pricing and full details."
                />
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className={eyebrowClass}>At a glance</p>
          <h2 className={`${sectionTitleClass} mt-4`}>Built around the way you learn.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40 sm:text-base sm:leading-7">
            A small, considered catalogue instead of an endless feed. Every
            format is built to keep the signal high.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            {
              value: workshops.length.toString().padStart(2, "0"),
              label: "live sessions",
              description: "Free and premium workshops currently open.",
            },
            {
              value: "02",
              label: "ways to learn",
              description: "Community sessions and focused small groups.",
            },
            {
              value: "100%",
              label: "access-gated",
              description: "Private meeting links are never exposed.",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-[25px] border border-white/10 bg-[#060607]/85 p-6 sm:p-8"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-white/[0.035] blur-2xl transition-colors duration-500 group-hover:bg-violet-400/10"
                aria-hidden="true"
              />
              <p className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-white/65">{stat.label}</p>
              <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-5 text-white/30">
                {stat.description}
              </p>
              <span
                className="mt-8 grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-white/45"
                aria-hidden="true"
              >
                <span className="text-xs">0{index + 1}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-[1280px] px-5 pb-8 pt-12 sm:px-8 sm:pb-16">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#050506] px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-10 sm:py-16 lg:px-14">
          <div
            className="pointer-events-none absolute -left-24 top-0 size-80 rounded-full bg-violet-600/15 blur-[100px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_right,transparent,black_45%,black)]"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className={eyebrowClass}>Ready when you are</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-5xl">
                Learn something
                <span className="text-gradient block">worth showing up for.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/40 sm:text-base">
                Browse the catalogue, join a free session, or unlock a focused
                deep dive. Your next useful idea is one session away.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="#workshops" className={primaryButton}>
                  Browse the catalogue
                </Link>
                {!user ? (
                  <Link href="/register" className={secondaryButton}>
                    Join Workshop Hub
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center">
              <div className="orb animate-glow size-full" aria-hidden="true" />
              <div
                className="animate-orbit absolute inset-3 rounded-full border border-violet-300/15"
                aria-hidden="true"
              >
                <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-violet-200 shadow-[0_0_20px_rgba(196,181,253,0.95)]" />
              </div>
              <div
                className="absolute -bottom-2 left-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[10px] text-white/55 backdrop-blur-md sm:left-6"
                aria-hidden="true"
              >
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-300" />
                Open for enrollment
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
