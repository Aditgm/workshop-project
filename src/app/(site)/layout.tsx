import type { ReactNode } from "react";
import { getSiteContent } from "@/lib/site-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EventPopup } from "@/components/marketing/event-popup";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-cream"
      >
        Skip to content
      </a>
      <div className="site-backdrop" aria-hidden="true" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
      <EventPopup
        config={content.eventPopup}
        workshops={content.dailyWorkshops}
      />
    </>
  );
}
