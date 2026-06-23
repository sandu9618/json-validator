import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "./constants";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: siteUrl,
  ogImage: "/og-image.svg",
};

export function buildPageMetadata(options?: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const title = options?.title ?? `${SITE_NAME} — Format and Validate JSON Online`;
  const description = options?.description ?? SITE_DESCRIPTION;
  const url = `${siteConfig.url}${options?.path ?? ""}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
    robots: { index: true, follow: true },
  };
}
