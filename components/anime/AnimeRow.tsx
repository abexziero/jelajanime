import { AnimeCard } from "./AnimeCard";
import { Reveal } from "@/components/anim/Reveal";
import type { CatalogItem } from "@/lib/providers";

export function AnimeRow({
  title,
  items,
}: {
  title: string;
  items: CatalogItem[];
}) {
  return (
    <Reveal className="space-y-3">
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-10">
        <h2
          data-reveal
          className="font-display text-2xl tracking-wide sm:text-3xl"
        >
          {title}
        </h2>
        <button className="text-xs font-medium text-muted transition hover:text-accent-text">
          Lihat semua
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-3 sm:px-6 lg:px-10">
        {items.map((item) => (
          <AnimeCard
            key={item.id}
            anime={item}
            className="w-40 shrink-0 sm:w-44"
            dataReveal
          />
        ))}
      </div>
    </Reveal>
  );
}
