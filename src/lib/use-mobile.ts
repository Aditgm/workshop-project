"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Detects if the current client is a mobile device based on:
 * - Viewport width (< 768px)
 * - User agent touch / mobile indicators
 */
export function useIsMobile(): boolean {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (!isClient) return;

    const checkMobile = () => {
      const isNarrow = window.innerWidth < 768;
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      const detected = isNarrow || (isTouch && window.innerWidth < 1024);
      setIsMobile(detected);

      // Set data attribute on documentElement for CSS styling
      if (detected) {
        document.documentElement.dataset.device = "mobile";
      } else {
        delete document.documentElement.dataset.device;
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    window.addEventListener("orientationchange", checkMobile, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, [isClient]);

  return isMobile;
}
