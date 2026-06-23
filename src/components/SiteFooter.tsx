import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} JSON Formatter & Validator</p>
        <nav aria-label="Footer">
          <Link
            href="/privacy"
            className="hover:text-zinc-800"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
