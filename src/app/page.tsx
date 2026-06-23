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
