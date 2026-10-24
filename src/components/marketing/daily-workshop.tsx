"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Container,
  SectionLabel,
  marketingSection,
  primaryButton,
  secondaryButton,
} from "@/components/marketing/marketing-ui";
import type { WorkshopItem } from "@/lib/site-content";

export function DailyWorkshopSection({
  workshop,
  workshops,
  isPreview = false,
}: {
  workshop?: WorkshopItem;
  workshops?: WorkshopItem[];
  isPreview?: boolean;
}) {
  // Consolidate workshops list
  const list: WorkshopItem[] = workshops && workshops.length > 0
    ? workshops
    : workshop
      ? [workshop]
      : [];

  // In production, only show active workshops unless in admin preview mode
  const activeList = isPreview ? list : list.filter((w) => w.isActive);

  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (activeList.length === 0) {
    if (isPreview) {
      return (
        <div className="rounded-[2px] border border-amber-500/30 bg-amber-500/10 p-6 text-center text-sm text-amber-900">
          No active workshops to display. Toggle &quot;Active&quot; on at least one workshop to preview it.
        </div>
      );
    }
    return null;
  }

  // Ensure active index is within bounds
  const currentWorkshop = activeList[activeIndex] || activeList[0];
  const photos = currentWorkshop.photos || [];
  const activePhoto = selectedPhoto || photos[0];

  const handleCopyLink = async () => {
    if (!currentWorkshop.meetingLink) return;
    try {
      await navigator.clipboard.writeText(currentWorkshop.meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const switchWorkshop = (index: number) => {
    setActiveIndex(index);
    setSelectedPhoto(null);
  };

  return (
    <section className={`${marketingSection} relative overflow-hidden bg-cream-soft border-b border-navy/15`}>
      {/* Background architectural grain pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(10,35,56,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(10,35,56,0.04)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <Container className="relative">
        {/* Section Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
              </span>
              <SectionLabel index="02">
                {currentWorkshop.badge || "Live Daily Workshop"}
              </SectionLabel>
              {activeList.length > 1 ? (
                <span className="rounded-[2px] border border-navy/15 bg-cream px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy/60">
                  {activeList.length} Sessions Available
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-[-0.03em] text-navy sm:text-5xl lg:text-6xl max-w-3xl">
              {currentWorkshop.title || "Daily Commercial Workshop"}
            </h2>
          </div>

          {/* Time & Rhythm tags */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-navy/75">
            {currentWorkshop.date ? (
              <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-navy/20 bg-cream px-3 py-1.5 shadow-xs">
                <svg className="size-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {currentWorkshop.date}
              </span>
            ) : null}
            {currentWorkshop.time ? (
              <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-navy/20 bg-cream px-3 py-1.5 shadow-xs">
                <svg className="size-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentWorkshop.time}
              </span>
            ) : null}
          </div>
        </div>

        {/* Multiple Workshops Tab Bar if 2 or more workshops exist */}
        {activeList.length > 1 ? (
          <div className="mt-8 border-b border-navy/15 pb-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/40">
              Select a workshop session:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {activeList.map((item, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => switchWorkshop(idx)}
                    className={`group flex items-center gap-2.5 rounded-[2px] border px-4 py-2.5 text-left text-xs font-semibold transition-all ${
                      isCurrent
                        ? "border-navy bg-navy text-cream shadow-sm"
                        : "border-navy/15 bg-cream/80 text-navy hover:border-navy/40 hover:bg-cream"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isCurrent ? "bg-gold" : "bg-navy/30 group-hover:bg-gold"
                      }`}
                    />
                    <span className="max-w-[220px] truncate">{item.title}</span>
                    {item.badge ? (
                      <span
                        className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[1px] ${
                          isCurrent
                            ? "bg-gold/20 text-gold-soft"
                            : "bg-navy/5 text-navy/50"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Content & Media Grid */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">
          {/* Photos Showcase */}
          <div className="order-2 lg:order-1">
            {photos.length > 0 ? (
              <div className="space-y-4">
                {/* Main Featured Photo */}
                <div className="group relative aspect-[16/10] overflow-hidden rounded-[2px] border border-navy/20 bg-navy/5 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhoto}
                    alt={currentWorkshop.title}
                    className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-80"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-cream">
                    <span className="font-semibold uppercase tracking-[0.16em] text-gold-soft text-[10px]">
                      Workshop Session Photo
                    </span>
                    <span className="rounded-[2px] bg-navy/70 backdrop-blur px-2 py-0.5 text-[10px] uppercase tracking-wider text-cream/90">
                      Live Cohort
                    </span>
                  </div>
                </div>

                {/* Thumbnails if multiple photos */}
                {photos.length > 1 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {photos.map((p, idx) => (
                      <button
                        key={`${p}-${idx}`}
                        type="button"
                        onClick={() => setSelectedPhoto(p)}
                        className={`relative aspect-[16/10] overflow-hidden rounded-[2px] border transition ${
                          activePhoto === p
                            ? "border-gold ring-2 ring-gold/30"
                            : "border-navy/15 opacity-70 hover:opacity-100 hover:border-navy/40"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p}
                          alt={`Workshop thumbnail ${idx + 1}`}
                          className="size-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="aspect-[16/10] rounded-[2px] border border-dashed border-navy/20 bg-cream flex flex-col items-center justify-center p-8 text-center">
                <span className="text-3xl mb-2">🏛️</span>
                <p className="font-display text-xl text-navy">Live Daily Workshop</p>
                <p className="mt-1 text-xs text-ink/60 max-w-sm">
                  Interactive real-time commercial training with leadership.
                </p>
              </div>
            )}
          </div>

          {/* Description & Action CTA */}
          <div className="order-1 lg:order-2 flex flex-col justify-between h-full space-y-8">
            <div className="space-y-6">
              <div className="border-l-2 border-gold pl-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Session Overview
                </p>
                <p className="mt-3 text-base leading-7 text-ink/80 whitespace-pre-line sm:text-lg sm:leading-8">
                  {currentWorkshop.description}
                </p>
              </div>

              <div className="grid gap-3 pt-4 border-t border-navy/10 sm:grid-cols-2">
                <div className="rounded-[2px] border border-navy/10 bg-cream p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/40">
                    Who should attend
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-navy">
                    Revenue professionals, sales leaders, and founders.
                  </p>
                </div>
                <div className="rounded-[2px] border border-navy/10 bg-cream p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/40">
                    Format & Interaction
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-navy">
                    Live video meeting, interactive Q&amp;A, and pipeline drills.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-navy/15 space-y-4">
              {currentWorkshop.meetingLink ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <a
                    href={currentWorkshop.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${primaryButton} text-center`}
                  >
                    <svg className="size-4 text-gold-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Live Meeting
                    <ArrowUpRight />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`${secondaryButton} text-xs`}
                  >
                    {copied ? (
                      <span className="text-emerald-700 font-semibold">✓ Link Copied!</span>
                    ) : (
                      <>
                        <svg className="size-3.5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy meeting link
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="rounded-[2px] border border-amber-600/20 bg-amber-500/10 p-4 text-xs text-amber-900">
                  <p className="font-semibold">Meeting link will open prior to start time.</p>
                  <p className="mt-1 text-amber-800/80">Check back at the scheduled workshop time to join the live session.</p>
                </div>
              )}

              <p className="text-[11px] text-ink/50">
                Live sessions are hosted directly on Google Meet, Zoom, or Teams. No software installation required.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
