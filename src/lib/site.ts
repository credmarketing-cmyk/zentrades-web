// Single source of truth for site-wide SEO values.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zentrades.pro").replace(/\/$/, "");

export const SITE_NAME = "ZenTrades";

// Matches the existing WordPress pattern "Page Title - ZenTrades".
export const TITLE_TEMPLATE = `%s - ${SITE_NAME}`;

export const DEFAULT_TITLE = "ZenTrades | A Field Service Management Software - ZenTrades";

export const DEFAULT_DESCRIPTION =
  "Mobile-first, compliance-ready and real-time all-in-one field service platform for trade businesses.";

// TODO: replace with a 1200x630 social image once the new design assets exist.
export const DEFAULT_OG_IMAGE = "/og-default.png";

// Only the production deployment may be indexed; previews and local builds stay hidden from Google.
export const IS_INDEXABLE =
  process.env.VERCEL_ENV === "production" || process.env.ALLOW_INDEXING === "true";
