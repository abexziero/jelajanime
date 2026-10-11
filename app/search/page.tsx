import type { Metadata } from "next";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { SearchBar } from "@/components/search/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/anim/Reveal";
import { IconSearch } from "@/components/icons";
import { catalog } from "@/lib/providers";

export const instant = false;

export const metadata: Metadata = { title: "Cari Anime" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const results = q.length >= 2 ? await catalog.search(q, 1, 24) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl tracking-wide sm:text-5xl">
        Cari Anime
      </h1>

      <div className="mt-5 max-w-xl">
        <SearchBar initialQuery={q} />
      </div>

      {q.length < 2 ? (
        <EmptyState
          icon={<IconSearch width={22} height={22} />}
          title="Mulai mencari"
          description="Ketik minimal 2 huruf untuk menemukan anime favoritmu."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={<IconSearch width={22} height={22} />}
          title="Tidak ada hasil"
          description={`Tidak ditemukan anime untuk “${q}”. Coba kata kunci lain.`}
          action={{ href: "/browse", label: "Jelajahi anime" }}
        />
      ) : (
        <>
          <p className="mt-8 text-sm text-muted">
            {results.length} hasil untuk &ldquo;{q}&rdquo;
          </p>
          <Reveal className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} dataReveal viewTransition />
            ))}
          </Reveal>
        </>
      )}
    </div>
  );
}
