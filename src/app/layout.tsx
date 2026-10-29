import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import { MobileDetector } from "@/components/mobile-detector";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hunt n Farm | Commercial education, advisory and community",
    template: "%s | Hunt n Farm",
  },
  description:
    "Hunt n Farm brings together First Quota, a six-week tech-sales academy, practical go-to-market advisory for companies, and Revenue Lab, a free weekly community.",
  applicationName: "Hunt n Farm",
  openGraph: {
    type: "website",
    siteName: "Hunt n Farm",
    title: "Hunt n Farm | Commercial education, advisory and community",
    description:
      "Practical commercial education, go-to-market advisory, and a community for people doing the work.",
    url: siteUrl,
    images: [
      {
        url: "/brand/huntnfarm-logo-navy.png",
        width: 1080,
        height: 1080,
        alt: "Hunt n Farm Logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/brand/huntnfarm-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0a2338",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">
        <MobileDetector />
        {children}
      </body>
    </html>
  );
}
