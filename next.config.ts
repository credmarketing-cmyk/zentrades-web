import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Live URLs have no trailing slash (e.g. /about-us); keep it that way so canonicals match.
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  // 301s keep ranking signals when a URL changes. Add one for every old WordPress URL
  // that does not exist on the new site (old page -> closest new page).
  async redirects() {
    return [
      { source: "/bookdemo", destination: "/book-demo", permanent: true },
      { source: "/case-study", destination: "/case-studies", permanent: true },
      { source: "/feed", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
