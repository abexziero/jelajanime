import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/providers";

export function AnimeCard({
  anime,
  className = "",
  dataReveal,
  viewTransition = false,
}: {
  anime: CatalogItem;
  className?: string;
  dataReveal?: boolean;
  // Aktifkan morph poster hanya di konteks di mana tiap anime tampil sekali
  // (grid browse/search) — mencegah `view-transition-name` duplikat.
  viewTransition?: boolean;
}) {
  const poster = (
    <div className="relative aspect-[460/649] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-line transition duration-300 group-hover:ring-accent group-hover:shadow-[0_10px_30px_-12px] group-hover:shadow-scrim/40">
      {anime.coverImage ? (
        <Image
          src={anime.coverImage}
          alt={anime.title}
          fill
          sizes="176px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ backgroundColor: anime.coverColor ?? "#fff7da" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/10 to-transparent opacity-90" />
      {anime.score ? (
        <span className="absolute left-2 top-2 rounded-md bg-scrim/90 px-1.5 py-0.5 text-xs font-semibold text-accent">
          ★ {anime.score.toFixed(1)}
        </span>
      ) : null}
    </div>
  );

  return (
    <Link
      href={`/anime/${anime.id}`}
      className={`group block ${className}`}
      data-reveal={dataReveal ? "" : undefined}
    >
      {viewTransition ? (
        <ViewTransition name={`poster-${anime.id}`}>{poster}</ViewTransition>
      ) : (
        poster
      )}
      <h3 className="mt-2 line-clamp-1 text-sm font-medium">{anime.title}</h3>
      <p className="text-xs text-muted">
        {[anime.format, anime.year].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}
