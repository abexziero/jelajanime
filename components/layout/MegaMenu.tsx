"use client";

import Link from "next/link";
import { genreLabel } from "@/lib/genres";
import { IconChevronDown } from "@/components/icons";

// Mega-menu glass. Panel = translucent (tanpa backdrop-blur) supaya tidak
// double-blur di dalam bar ber-blur. Buka via hover DAN focus-within (keyboard).
export function MegaMenu({
  genres,
  scrolled = true,
}: {
  genres: string[];
  scrolled?: boolean;
}) {
  if (genres.length === 0) return null;

  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition hover:bg-surface/60 hover:text-foreground group-focus-within:text-foreground ${
          scrolled ? "text-muted" : "text-white/80"
        }`}
      >
        Kategori
        <IconChevronDown
          width={14}
          height={14}
          className="transition group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </button>

      <div
        className="invisible absolute left-1/2 top-full z-50 mt-3 w-[min(90vw,40rem)] -translate-x-1/2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 motion-reduce:transition-none"
        role="menu"
      >
        <div className="rounded-2xl border border-line bg-surface/95 p-4 text-foreground shadow-2xl shadow-black/10">
          <p className="px-2 text-[11px] uppercase tracking-[0.2em] text-muted">
            Genre
          </p>
          <div className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-3">
            {genres.map((genre) => (
              <Link
                key={genre}
                href={`/browse?genre=${encodeURIComponent(genre)}`}
                role="menuitem"
                className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-accent/10 hover:text-accent-text"
              >
                {genreLabel(genre)}
              </Link>
            ))}
          </div>
          <Link
            href="/browse"
            className="mt-3 flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent-text"
          >
            Lihat semua anime
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
