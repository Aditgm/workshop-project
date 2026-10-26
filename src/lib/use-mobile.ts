"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback, { passive: true });
  window.addEventListener("orientationchange", callback, { passive: true });
  return () => {
    window.removeEventListener("resize", callback);
    window.removeEventListener("orientationchange", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const isNarrow = window.innerWidth < 768;
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  return isNarrow || (isTouch && window.innerWidth < 1024);
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Detects if the current client is a mobile device based on:
 * - Viewport width (< 768px)
 * - User agent touch / mobile indicators
 */
export function useIsMobile(): boolean {
  const isMobile = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (isMobile) {
      document.documentElement.dataset.device = "mobile";
    } else {
      delete document.documentElement.dataset.device;
    }
  }, [isMobile]);

  return isMobile;
}

