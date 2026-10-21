import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutButton } from "@/components/checkout-button";
import {
  Badge,
  eyebrowClass,
  Notice,
  panelClass,
  primaryButton,
  secondaryButton,
  subtleButton,
} from "@/components/ui";
import {
  canAccessJoinLink,
  canPurchaseWorkshop,
  canViewWorkshop,
  isAdmin,
} from "@/lib/access";
import { getSessionUser, loginUrl } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime, formatPrice } from "@/lib/format";
import { isDevPaymentSimulationAllowed } from "@/lib/stripe";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ payment?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await db.workshop.findUnique({
    where: { slug },
    select: { title: true, summary: true, published: true },
  });

  if (!workshop || !workshop.published) {
    return { title: "Workshop not found", robots: { index: false } };
  }

  return {
    title: workshop.title,
    description: workshop.summary,
  };
}

export default async function WorkshopPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const paymentValue = Array.isArray(query.payment)
    ? query.payment[0]
    : query.payment;

  const [user, workshop] = await Promise.all([
    getSessionUser(),
    db.workshop.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        description: true,
        type: true,
        priceCents: true,
        currency: true,
        startsAt: true,
        endsAt: true,
        location: true,
        meetingUrl: true,
        capacity: true,
        coverImageUrl: true,
        published: true,
        notificationSentAt: true,
        _count: {
          select: { purchases: { where: { status: "PAID" } } },
        },
      },
    }),
  ]);

  if (!workshop || !canViewWorkshop(workshop, user)) {
    notFound();
  }

  const purchase = user
    ? await db.workshopPurchase.findUnique({
        where: {
          userId_workshopId: { userId: user.id, workshopId: workshop.id },
        },
        select: { status: true },
      })
    : null;

  const hasPaidAccess = purchase?.status === "PAID";
  const canAccess = canAccessJoinLink(workshop, user, hasPaidAccess);
  const canPurchase = canPurchaseWorkshop(workshop, user, hasPaidAccess);
  const isPrivate = workshop.type === "PRIVATE";
  const enrolled = workshop._count.purchases;
  const remaining =
    workshop.capacity !== null ? Math.max(workshop.capacity - enrolled, 0) : null;
  const soldOut = remaining === 0;
  const sharePath = `/workshops/${workshop.slug}`;
  const monogram = workshop.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const seatPercent = workshop.capacity
    ? Math.min(100, Math.round((enrolled / Math.max(workshop.capacity, 1)) * 100))
    : 0;

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/" className={`${subtleButton} -ml-3 text-[13px]`}>
        <span
          className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5 motion-reduce:transform-none"
          aria-hidden="true"
        >
          &larr;
        </span>
        All workshops
      </Link>

      {!workshop.published ? (
        <div className="mt-6">
          <Notice tone="info">
            This workshop is a draft. Only administrators can see this page.
          </Notice>
        </div>
      ) : null}

      {paymentValue === "success" && hasPaidAccess ? (
        <div className="mt-6">
          <Notice tone="success">
            Payment confirmed. Your access link is ready below.
          </Notice>
        </div>
      ) : null}

      {paymentValue === "cancelled" ? (
        <div className="mt-6">
          <Notice tone="info">
            Checkout was cancelled. No payment was taken.
          </Notice>
        </div>
      ) : null}

      <div className="mt-7 grid gap-8 lg:grid-cols-[1.45fr_0.75fr] lg:items-start lg:gap-10">
        <div className="min-w-0">
          <div className="relative h-[280px] overflow-hidden rounded-[30px] border border-white/10 bg-[#07070a] shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:h-[400px]">
            {workshop.coverImageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(4,4,6,0.92), rgba(4,4,6,0.06)), url("${workshop.coverImageUrl}")`,
                }}
                aria-hidden="true"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: isPrivate
                    ? "radial-gradient(circle at 70% 20%, rgba(253,230,138,0.9), transparent 16%), radial-gradient(circle at 24% 76%, rgba(244,114,182,0.65), transparent 42%), radial-gradient(circle at 82% 84%, rgba(251,146,60,0.36), transparent 40%), linear-gradient(145deg, #fde68a 0%, #9d174d 38%, #13080d 100%)"
                    : "radial-gradient(circle at 74% 18%, rgba(221,214,254,0.95), transparent 17%), radial-gradient(circle at 22% 78%, rgba(37,99,235,0.75), transparent 44%), radial-gradient(circle at 82% 88%, rgba(167,139,250,0.45), transparent 38%), linear-gradient(145deg, #ede9fe 0%, #6d28d9 34%, #07070d 100%)",
                }}
                aria-hidden="true"
              />
            )}
            <div className="poster-art absolute inset-0 opacity-45" aria-hidden="true" />
            <div className="cover-grid absolute inset-0 opacity-25" aria-hidden="true" />
            <span
              className="absolute -bottom-12 right-4 select-none text-[12rem] font-semibold leading-none tracking-[-0.15em] text-white/[0.09] sm:text-[16rem]"
              aria-hidden="true"
            >
              {monogram}
            </span>
            <div
              className="absolute -right-24 -top-28 size-80 rounded-full border border-white/15"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-32 left-16 size-80 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 p-5">
              <Badge tone={isPrivate ? "amber" : "green"}>
                {isPrivate ? "Paid workshop" : "Public workshop"}
              </Badge>
              {!workshop.published ? <Badge tone="red">Draft</Badge> : null}
              <span className="glass-pill ml-auto rounded-full px-3 py-1.5 text-[11px] text-white/75">
                {workshop.capacity ? `${remaining} seats left` : "Open capacity"}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                {isPrivate ? "Small-group intensive" : "Community session"}
              </p>
              <p className="mt-2 text-sm text-white/85">
                {formatDateTime(workshop.startsAt)}
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <p className={eyebrowClass}>
              {isPrivate ? "Premium workshop" : "Free workshop"}
            </p>
            <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              {workshop.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
              {workshop.summary}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
              <p className={eyebrowClass}>Schedule</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/85">
                {formatDateTime(workshop.startsAt)}
              </p>
              {workshop.endsAt ? (
                <p className="mt-1 text-xs text-white/35">
                  Ends {formatDateTime(workshop.endsAt)}
                </p>
              ) : null}
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
              <p className={eyebrowClass}>Format</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/85">
                {workshop.location || "Online"}
              </p>
              <p className="mt-1 text-xs text-white/35">
                {isPrivate ? "Small-group, paid access" : "Open to all members"}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
              <p className={eyebrowClass}>Availability</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/85">
                {workshop.capacity
                  ? `${enrolled} of ${workshop.capacity} seats filled`
                  : "Open capacity"}
              </p>
              <p className="mt-1 text-xs text-white/35">
                {soldOut ? "This session is full" : "Reserve your place"}
              </p>
            </div>
          </div>

          <section className={`${panelClass} mt-8 p-6 sm:p-8`}>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-violet-200">
                <span className="size-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.8)]" />
              </span>
              <h2 className="text-lg font-medium tracking-[-0.025em] text-white">
                About this workshop
              </h2>
            </div>
            <div className="mt-6 whitespace-pre-line text-sm leading-7 text-white/50">
              {workshop.description}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className={`${panelClass} overflow-hidden`}>
            <div className="relative overflow-hidden border-b border-white/[0.08] p-6">
              <div
                className="pointer-events-none absolute -right-14 -top-16 size-48 rounded-full bg-violet-500/[0.12] blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className={eyebrowClass}>Access</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-white">
                    {formatPrice(workshop.priceCents, workshop.currency)}
                  </p>
                </div>
                <Badge tone={isPrivate ? "amber" : "green"}>
                  {isPrivate ? "Paid" : "Free"}
                </Badge>
              </div>

              <div className="relative mt-5 space-y-3 border-t border-white/[0.08] pt-5 text-sm">
                <p className="flex items-start justify-between gap-3">
                  <span className="text-white/35">Starts</span>
                  <span className="text-right font-medium text-white/75">
                    {formatDateTime(workshop.startsAt)}
                  </span>
                </p>
                <p className="flex items-start justify-between gap-3">
                  <span className="text-white/35">Location</span>
                  <span className="text-right font-medium text-white/75">
                    {workshop.location || "Online"}
                  </span>
                </p>
                {workshop.capacity ? (
                  <div>
                    <p className="flex items-start justify-between gap-3">
                      <span className="text-white/35">Seats</span>
                      <span className="text-right font-medium text-white/75">
                        {remaining} remaining of {workshop.capacity}
                      </span>
                    </p>
                    <div
                      className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                          soldOut
                            ? "bg-gradient-to-r from-rose-400 to-red-300"
                            : "bg-gradient-to-r from-violet-300 to-white"
                        }`}
                        style={{ width: `${seatPercent}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="p-6">
              {canAccess ? (
                <div>
                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.06] p-4">
                    <p className="text-sm font-medium text-emerald-100">
                      {isPrivate ? "You have access" : "Access included"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-emerald-100/55">
                      The meeting link is personalized to your account. Do not
                      share it publicly.
                    </p>
                  </div>
                  <a
                    href={workshop.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`${primaryButton} mt-4 w-full py-3`}
                  >
                    Open meeting link
                    <span className="grid size-5 place-items-center rounded-full bg-zinc-950 text-[10px] text-white">
                      <span aria-hidden="true">&#8599;</span>
                    </span>
                  </a>
                </div>
              ) : canPurchase ? (
                soldOut ? (
                  <Notice tone="error">
                    This workshop is full. Contact the organizer if you need help.
                  </Notice>
                ) : (
                  <CheckoutButton
                    workshopId={workshop.id}
                    returnTo={sharePath}
                    priceLabel={formatPrice(workshop.priceCents, workshop.currency)}
                    simulated={isDevPaymentSimulationAllowed()}
                  />
                )
              ) : !user ? (
                <div>
                  <p className="text-sm leading-6 text-white/45">
                    {isPrivate
                      ? "Sign in to purchase this workshop and unlock the access link."
                      : "Sign in to reveal the meeting link for this free workshop."}
                  </p>
                  <Link
                    href={loginUrl(sharePath)}
                    className={`${primaryButton} mt-4 w-full py-3`}
                  >
                    Sign in to continue
                  </Link>
                  <Link
                    href={`/register?next=${encodeURIComponent(sharePath)}`}
                    className={`${secondaryButton} mt-2 w-full py-3`}
                  >
                    Create an account
                  </Link>
                </div>
              ) : (
                <Notice tone="info">
                  {isPrivate
                    ? "Your payment for this workshop is still pending. Visit your dashboard or try checkout again."
                    : "This workshop is not currently available."}
                </Notice>
              )}

              {isAdmin(user) ? (
                <Link
                  href={`/admin/workshops/${workshop.id}/edit`}
                  className={`${secondaryButton} mt-3 w-full`}
                >
                  Edit workshop
                </Link>
              ) : null}

              <p className="mt-5 text-center text-[11px] leading-5 text-white/25">
                {isPrivate
                  ? "Paid access is verified with Stripe before private links are shown."
                  : "Public workshop notifications are delivered in-app to every member."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
