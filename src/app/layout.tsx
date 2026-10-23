import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
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
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
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
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
