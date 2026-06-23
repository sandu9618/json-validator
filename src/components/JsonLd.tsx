import { SITE_NAME } from "@/lib/constants";
import { siteConfig } from "@/lib/metadata";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description: siteConfig.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires JavaScript for interactive formatting",
    featureList: [
      "JSON validation",
      "JSON formatting and beautification",
      "Copy to clipboard",
      "Download as file",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
