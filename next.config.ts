import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Live URLs have no trailing slash (e.g. /about-us); keep it that way so canonicals match.
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Never let Google index the *.vercel.app copy; only the real domain (zentrades.pro) may rank.
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
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
