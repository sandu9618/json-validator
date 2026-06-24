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
        <header className="mb-8 text-center sm:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
            Free &amp; browser-based
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            JSON Formatter
            <span className="text-blue-600"> &amp; Validator</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:mx-0 sm:text-lg">
            {SITE_DESCRIPTION}
          </p>
        </header>

        <p className="trust-badge mb-6">
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

        <article className="mt-16 rounded-2xl border border-slate-200/80 bg-white/60 p-6 backdrop-blur-sm sm:p-10">
          <SeoContent />
          <FaqSection />
        </article>

        <SiteFooter />
      </main>
    </>
  );
}
