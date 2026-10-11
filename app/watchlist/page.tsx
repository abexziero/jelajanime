"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconBookmark } from "@/components/icons";
import { useWatchlist } from "@/lib/watchlist";
import { Flip, gsap, prefersReducedMotion } from "@/lib/gsap";

const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

export default function WatchlistPage() {
  const { entries, remove } = useWatchlist();
  const mounted = useMounted();
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const handleRemove = (id: number) => {
    if (gridRef.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(
        gridRef.current.querySelectorAll("[data-flip-card]"),
      );
    }
    remove(id);
  };

  // Reflow halus kartu yang tersisa setelah penghapusan (GSAP Flip).
  useEffect(() => {
    if (!flipState.current || !gridRef.current) return;
    Flip.from(flipState.current, {
      duration: 0.45,
      ease: "power2.inOut",
      absolute: true,
      onComplete: () => {
        const grid = gridRef.current;
        if (grid) {
          gsap.set(grid.querySelectorAll("[data-flip-card]"), {
            clearProps: "position,width,height,transform",
          });
        }
      },
    });
    flipState.current = null;
  }, [entries]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl tracking-wide sm:text-5xl">
        Watchlist
      </h1>

      {!mounted ? (
        <p className="mt-8 text-sm text-muted">Memuat…</p>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<IconBookmark width={22} height={22} />}
          title="Watchlist kosong"
          description="Simpan anime favoritmu agar mudah ditemukan lagi nanti."
          action={{ href: "/browse", label: "Jelajahi anime" }}
        />
      ) : (
        <div
          ref={gridRef}
          className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {entries.map((entry) => (
            <div key={entry.id} data-flip-card className="group">
              <Link
                href={`/anime/${entry.id}`}
                className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-line transition group-hover:ring-accent/60"
              >
                {entry.coverImage ? (
                  <Image
                    src={entry.coverImage}
                    alt={entry.title}
                    fill
                    sizes="176px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/10 to-transparent" />
              </Link>
              <div className="mt-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-sm font-medium">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-muted">
                    {[entry.format, entry.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(entry.id)}
                  aria-label={`Hapus ${entry.title} dari watchlist`}
                  className="shrink-0 rounded-full border border-line px-2 py-1 text-xs text-muted transition hover:border-accent/50 hover:text-accent-text"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
