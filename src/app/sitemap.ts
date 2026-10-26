import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes
    .filter((r) => r.built)
    .map((r) => ({
      url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
      priority: r.priority ?? 0.7,
    }));
}
