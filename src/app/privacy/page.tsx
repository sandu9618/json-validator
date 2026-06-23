import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = buildPageMetadata({
  title: "Privacy Policy — JSON Formatter & Validator",
  description:
    "Privacy policy for the JSON Formatter & Validator. All JSON processing runs locally in your browser — no data is sent to our servers.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to tool
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-zinc-600">
          Last updated: June 23, 2026
        </p>
      </header>

      <article className="prose prose-zinc max-w-none space-y-6">
        <section>
          <h2>Overview</h2>
          <p>
            JSON Formatter &amp; Validator is a free browser-based tool. We designed
            it so your JSON data stays on your device.
          </p>
        </section>

        <section>
          <h2>Data we do not collect</h2>
          <p>
            When you paste JSON into the tool, it is processed entirely in your
            browser using JavaScript. We do not upload, store, or transmit your
            JSON input or formatted output to any server.
          </p>
        </section>

        <section>
          <h2>Data we may collect</h2>
          <p>
            Like most websites, our hosting provider may log standard request
            metadata (IP address, browser type, pages visited) for security and
            performance. We do not use this data to identify individual users or
            associate it with JSON content.
          </p>
        </section>

        <section>
          <h2>Cookies and analytics</h2>
          <p>
            This site does not set tracking cookies by default. If analytics are
            added in the future, this policy will be updated accordingly.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For privacy-related questions, please contact us through the project
            repository or website contact form when available.
          </p>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
