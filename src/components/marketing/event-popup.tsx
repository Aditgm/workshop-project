"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { EventPopupConfig, WorkshopItem } from "@/lib/site-content";

const emptySubscribe = () => () => {};

export function EventPopup({
  config,
  workshops = [],
  isPreview = false,
}: {
  config: EventPopupConfig;
  workshops?: WorkshopItem[];
  isPreview?: boolean;
}) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [isOpen, setIsOpen] = useState(isPreview);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter active workshops
  const activeWorkshops = workshops.filter((w) => w.isActive);

  // In preview mode or custom mode with no active workshops, ensure fallback
  const totalEvents =
    config.mode === "custom"
      ? 1
      : activeWorkshops.length > 0
        ? config.mode === "first_active"
          ? 1
          : activeWorkshops.length
        : 1;

  // Resolve current event details
  const hasWorkshop = config.mode !== "custom" && activeWorkshops.length > 0;
  const currentWorkshop = hasWorkshop
    ? activeWorkshops[currentIndex] || activeWorkshops[0]
    : null;

  const kicker =
    currentWorkshop?.badge?.trim() || config.kicker || "HAPPENING TODAY";

  const title =
    (config.mode === "custom" ? config.title : currentWorkshop?.title) ||
    config.title ||
    "Revenue Lab: From strategy to action";

  const description =
    (config.mode === "custom"
      ? config.description
      : currentWorkshop?.description) ||
    config.description ||
    "Learn one practical way to improve your sales process in this week's live session.";

  const workshopDateTime = currentWorkshop
    ? [currentWorkshop.date, currentWorkshop.time].filter(Boolean).join(" · ")
    : "";

  const dateTime =
    (config.mode === "custom" ? config.dateTime : workshopDateTime) ||
    config.dateTime ||
    "Today · 6:00 PM IST";

  const ctaLink =
    (config.mode === "custom"
      ? config.ctaLink
      : currentWorkshop?.meetingLink) ||
    config.ctaLink ||
    "https://meet.google.com";

  const ctaText = config.ctaText || "Register for free";
  const secondaryText = config.secondaryText || "Maybe later";

  // Trigger popup on every page refresh/load
  useEffect(() => {
    if (isPreview || !config.enabled) {
      return;
    }

    // Only skip if explicitly set to once_a_day in admin panel
    if (config.displayFrequency === "once_a_day") {
      const dismissedUntil = localStorage.getItem("hnf_event_popup_dismissed_until");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }
    }

    // Pop up promptly on every refresh
    const delayMs = Math.max(config.delaySeconds ?? 0.4, 0.1) * 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [config.enabled, config.delaySeconds, config.displayFrequency, isPreview]);

  const handleDismiss = () => {
    setIsOpen(false);

    if (!isPreview && config.displayFrequency === "once_a_day") {
      const expires = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("hnf_event_popup_dismissed_until", expires.toString());
    }
  };

  const handleNextEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalEvents > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalEvents);
    }
  };

  const handlePrevEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalEvents > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalEvents) % totalEvents);
    }
  };

  // If not mounted yet (SSR hydration), render nothing
  if (!isMounted) {
    return null;
  }

  // If in admin preview and disabled, or closed
  if (!config.enabled && !isPreview) {
    return null;
  }

  const popupContent = (
    <div
      aria-live="polite"
      className="event-popup-root fixed inset-0 pointer-events-none"
      style={{ zIndex: 999999 }}
    >
      {/* 
        Dark Scrim Backdrop
        Fixed to the visible viewport screen
      */}
      <div
        onClick={handleDismiss}
        aria-hidden="true"
        className={`fixed inset-0 bg-navy/40 backdrop-blur-[2px] transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 999998 }}
      />

      {/* 
        Floating Bottom Sheet Popup
        LOCKED TO ONSCREEN BOTTOM OF VIEWPORT
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Upcoming Event Announcement"
        className={`fixed inset-x-0 bottom-0 flex justify-center p-0 sm:p-5 transition-all duration-500 ease-out transform ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 999999 }}
      >
        <div className="relative w-full max-w-lg overflow-hidden rounded-t-[24px] sm:rounded-2xl border border-navy/20 bg-[#FAF7F0] p-5 sm:p-6 shadow-[0_24px_70px_rgba(10,35,56,0.36)] text-navy">
          {/* Subtle architectural grain texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(10,35,56,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(10,35,56,0.03)_1px,transparent_1px)] [background-size:32px_32px]"
          />

          {/* Mobile Drag Indicator Bar */}
          <div
            aria-hidden="true"
            className="mx-auto -mt-1 mb-3.5 h-1.5 w-12 rounded-full bg-navy/20 sm:hidden"
          />

          {/* Close Button "X" */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close event popup"
            className="group absolute right-3.5 top-3.5 sm:right-4 sm:top-4 flex size-8 items-center justify-center rounded-full text-navy/50 transition hover:bg-navy/10 hover:text-navy cursor-pointer"
          >
            <svg
              className="size-4.5 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Top Eyebrow & Multiple Events Switcher */}
          <div className="relative pr-8 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8860B]">
              {kicker}
            </span>

            {/* If multiple nearby events exist, show switcher */}
            {totalEvents > 1 ? (
              <div className="flex items-center gap-1.5 rounded-full border border-navy/15 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-navy/80 shadow-2xs">
                <span>
                  {currentIndex + 1} of {totalEvents} nearby
                </span>
                <div className="flex items-center gap-0.5 ml-0.5">
                  <button
                    type="button"
                    onClick={handlePrevEvent}
                    className="size-4 rounded flex items-center justify-center text-navy/70 hover:bg-navy/10 hover:text-navy transition cursor-pointer"
                    title="Previous nearby event"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextEvent}
                    className="size-4 rounded flex items-center justify-center text-navy/70 hover:bg-navy/10 hover:text-navy transition cursor-pointer"
                    title="Next nearby event"
                  >
                    ›
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Main Title */}
          <h3 className="relative mt-2 font-display text-2xl sm:text-[26px] font-bold tracking-[-0.025em] text-navy leading-[1.14]">
            {title}
          </h3>

          {/* Description */}
          <p className="relative mt-2 text-xs sm:text-[13px] leading-relaxed text-ink/75 line-clamp-3">
            {description}
          </p>

          {/* Clean Thin Divider */}
          <div className="relative my-3.5 border-t border-navy/10" />

          {/* Event Date & Time */}
          {dateTime ? (
            <div className="relative mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy">
              <svg
                className="size-4.5 text-[#B8860B] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{dateTime}</span>
            </div>
          ) : null}

          {/* CTA Buttons */}
          <div className="relative flex flex-col gap-2">
            <a
              href={ctaLink}
              target={ctaLink.startsWith("http") ? "_blank" : undefined}
              rel={ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#B8860B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9E7309] active:scale-[0.99] cursor-pointer"
            >
              <span>{ctaText}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </a>

            {/* Maybe later button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="mt-0.5 text-center text-xs font-medium text-navy/70 underline underline-offset-4 transition hover:text-navy cursor-pointer py-1"
            >
              {secondaryText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal directly to document.body so no parent container can ever restrict or misplace it
  return createPortal(popupContent, document.body);
}
