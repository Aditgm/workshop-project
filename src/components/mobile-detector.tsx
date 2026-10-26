"use client";

import { useIsMobile } from "@/lib/use-mobile";

/**
 * Headless component that listens to device changes and mounts
 * mobile-specific frames and touch attributes dynamically.
 */
export function MobileDetector() {
  useIsMobile();
  return null;
}
