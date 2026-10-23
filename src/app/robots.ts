import type { MetadataRoute } from "next";

const siteUrl = (process.env.SITE_URL?.trim() || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}