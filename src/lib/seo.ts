import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "./site";

type PageSeo = {
  // Shown as "<title> - ZenTrades". Pass absoluteTitle to opt out of the suffix.
  title: string;
  absoluteTitle?: boolean;
  description: string;
  // Must match the live WordPress URL exactly (no trailing slash), e.g. "/about-us".
  path: string;
  image?: string;
  noindex?: boolean;
};

export function pageMetadata({ title, absoluteTitle, description, path, image, noindex }: PageSeo): Metadata {
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    // Only set robots when overriding; an explicit undefined would drop the layout's preview noindex.
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
