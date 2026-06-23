import { JsonFormatterTool } from "@/components/JsonFormatterTool";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { SeoContent } from "@/components/SeoContent";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_DESCRIPTION } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            JSON Formatter &amp; Validator
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-600">
            {SITE_DESCRIPTION}
          </p>
        </header>

        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-800">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Runs locally — your JSON never leaves this device
        </p>

        <JsonFormatterTool />

        <article className="mt-16 border-t border-zinc-200 pt-12">
          <SeoContent />
          <FaqSection />
        </article>

        <SiteFooter />
      </main>
    </>
  );
}
