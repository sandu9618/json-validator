import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200/80 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} JSON Formatter & Validator</p>
        <nav aria-label="Footer">
          <Link
            href="/privacy"
            className="transition-colors hover:text-slate-800"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
