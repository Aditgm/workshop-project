import type { MetadataRoute } from "next";

const siteUrl = (process.env.SITE_URL?.trim() || "http://localhost:3000").replace(
  /\/$/,
  "",
);

const routes = [
  "",
  "/programs",
  "/placement",
  "/for-companies",
  "/resources",
  "/revenue-lab",
  "/rinassa-ai",
  "/about",
  "/contact",
  "/apply",
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/refund-policy",
  "/legal/placement-terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/apply" ? 0.9 : 0.7,
  }));
}
