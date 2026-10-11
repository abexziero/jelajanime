import Link from "next/link";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line/60 bg-surface/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-10">
        <div>
          <Link href="/" className="flex items-center">
            <p className="font-display text-xl tracking-wider">
              JELAJA<span className="text-accent-text">NIME</span>
            </p>
          </Link>
          <p className="mt-1 text-sm text-muted">{site.tagline}</p>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted">
          Data anime dari AniList (anilist.co). Jelajanime tidak berafiliasi
          dengan AniList.
        </p>
      </div>
    </footer>
  );
}
