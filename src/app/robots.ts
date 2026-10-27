import type { MetadataRoute } from "next";

import { site } from "@/shared/config";

// Required for metadata routes in static export (planning/ARCHITECTURE.md §10).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
