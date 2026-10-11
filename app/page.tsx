import { HeroCarousel } from "@/components/anime/HeroCarousel";
import { AnimeRow } from "@/components/anime/AnimeRow";
import { catalog } from "@/lib/providers";

export default async function HomePage() {
  const [trending, airing, top, popular, upcoming] = await Promise.all([
    catalog.trending(1, 12),
    catalog.airing(1, 12),
    catalog.topRated(1, 12),
    catalog.popular(1, 12),
    catalog.upcoming(1, 12),
  ]);

  const rows = [
    { title: "Trending Minggu Ini", items: trending },
    { title: "Sedang Tayang", items: airing },
    { title: "Rating Tertinggi", items: top },
    { title: "Paling Populer", items: popular },
    { title: "Akan Datang", items: upcoming },
  ].filter((row) => row.items.length > 0);

  return (
    <>
      {trending.length > 0 ? (
        <div className="-mt-20">
          <HeroCarousel items={trending} />
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl space-y-12 py-14">
        {rows.map((row) => (
          <AnimeRow key={row.title} title={row.title} items={row.items} />
        ))}
      </div>
    </>
  );
}
