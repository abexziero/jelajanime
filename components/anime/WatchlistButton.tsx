"use client";

import { useWatchlist } from "@/lib/watchlist";

type Props = {
  entry: {
    id: number;
    title: string;
    coverImage: string;
    year?: number | null;
    format?: string | null;
    score?: number | null;
  };
  className?: string;
};

export function WatchlistButton({ entry, className = "" }: Props) {
  const { has, toggle } = useWatchlist();
  const active = has(entry.id);

  return (
    <button
      type="button"
      onClick={() => toggle(entry)}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:brightness-110 ${
        active
          ? "bg-accent-deep text-foreground"
          : "border border-line bg-surface/60 text-foreground hover:border-accent/50"
      } ${className}`}
    >
      {active ? "✓ Di Watchlist" : "+ Watchlist"}
    </button>
  );
}
