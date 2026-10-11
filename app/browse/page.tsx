import Link from "next/link";
import type { Metadata } from "next";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { catalog } from "@/lib/providers";
import { genreAccent, genreAccentText, genreLabel } from "@/lib/genres";
import { FilterBar, type FilterGroup } from "@/components/browse/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/anim/Reveal";
import { IconCompass } from "@/components/icons";
import { FORMATS, SORTS, STATUSES, YEARS } from "@/lib/filters";

export const instant = false;

export const metadata: Metadata = { title: "Jelajahi Anime" };

const PER_PAGE = 24;

type Params = {
  genre?: string;
  format?: string;
  status?: string;
  year?: number;
  sort?: string;
  page?: number;
};

const buildHref = (params: Params, patch: Partial<Params>): string => {
  const merged = { ...params, ...patch };
  if (!("page" in patch)) merged.page = undefined;
  const sp = new URLSearchParams();
  if (merged.genre) sp.set("genre", merged.genre);
  if (merged.format) sp.set("format", merged.format);
  if (merged.status) sp.set("status", merged.status);
  if (merged.year) sp.set("year", String(merged.year));
  if (merged.sort && merged.sort !== "POPULARITY_DESC") sp.set("sort", merged.sort);
  if (merged.page && merged.page > 1) sp.set("page", String(merged.page));
  const qs = sp.toString();
  return qs ? `/browse?${qs}` : "/browse";
};

type Option = { value: string; label: string; href: string };

const withHref = (
  base: { value: string; label: string }[],
  params: Params,
  key: keyof Params,
  emptyLabel: string,
): Option[] => {
  const list = [{ value: "", label: emptyLabel }, ...base];
  return list.map((option) => ({
    value: option.value,
    label: option.label,
    href: buildHref(params, {
      [key]:
        key === "year"
          ? option.value
            ? Number(option.value)
            : undefined
          : option.value || undefined,
    } as Partial<Params>),
  }));
};

export default async function BrowsePage({ searchParams }: PageProps<"/browse">) {
  const sp = await searchParams;
  const params: Params = {
    genre: typeof sp.genre === "string" ? sp.genre : undefined,
    format: typeof sp.format === "string" ? sp.format : undefined,
    status: typeof sp.status === "string" ? sp.status : undefined,
    year: typeof sp.year === "string" ? Number(sp.year) : undefined,
    sort: typeof sp.sort === "string" ? sp.sort : undefined,
    page: typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1,
  };

  const [items, genres] = await Promise.all([
    catalog.discover({ ...params, perPage: PER_PAGE }),
    catalog.getGenres(),
  ]);

  const hasNext = items.length === PER_PAGE;
  const heading = params.genre
    ? genreLabel(params.genre)
    : params.year
      ? `Anime ${params.year}`
      : "Jelajahi Anime";
  const mood = genreAccent(params.genre);

  const sortOptions = withHref(SORTS.map((s) => ({ ...s })), params, "sort", "");
  sortOptions[0] = {
    value: "",
    label: "Urutkan: Populer",
    href: buildHref(params, { sort: undefined }),
  };

  const filters: FilterGroup[] = [
    {
      key: "format",
      label: "Format",
      value: params.format ?? "",
      options: withHref(FORMATS.map((f) => ({ ...f })), params, "format", "Semua Format"),
    },
    {
      key: "status",
      label: "Status",
      value: params.status ?? "",
      options: withHref(STATUSES.map((s) => ({ ...s })), params, "status", "Semua Status"),
    },
    {
      key: "year",
      label: "Tahun",
      value: params.year ? String(params.year) : "",
      options: withHref(
        YEARS.map((year) => ({ value: String(year), label: String(year) })),
        params,
        "year",
        "Semua Tahun",
      ),
    },
    {
      key: "sort",
      label: "Urutkan",
      value: params.sort ?? "",
      options: sortOptions,
    },
  ];

  return (
    <div
      className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10"
      style={{ "--mood": mood } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="edge-spotlight"
        style={{
          background: `radial-gradient(60% 60% at 8% 4%, color-mix(in oklab, ${mood} 16%, transparent) 0%, transparent 60%)`,
        }}
      />
      <div className="relative w-fit">
        <h1 className="font-display text-4xl tracking-wide sm:text-5xl">
          {heading}
        </h1>
        <span
          aria-hidden
          className="mt-2 block h-1 w-16 rounded-full"
          style={{ backgroundColor: mood }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={buildHref(params, { genre: undefined })} className={chip(!params.genre)}>
          Semua
        </Link>
        {genres.map((genre) => (
          <Link
            key={genre}
            href={buildHref(params, { genre })}
            className={chip(params.genre === genre)}
            style={
              params.genre === genre
                ? ({
                    borderColor: genreAccent(genre),
                    color: genreAccentText(genre),
                    backgroundColor: `${genreAccent(genre)}22`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {genreLabel(genre)}
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <FilterBar
          resetHref={
            params.genre
              ? `/browse?genre=${encodeURIComponent(params.genre)}`
              : "/browse"
          }
          activeCount={
            [params.format, params.status, params.year].filter(Boolean).length
          }
          groups={filters}
        />
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<IconCompass width={22} height={22} />}
          title="Tidak ada anime"
          description="Tidak ada anime yang cocok dengan filter ini. Coba ubah atau reset filter."
          action={{ href: "/browse", label: "Reset filter" }}
        />
      ) : (
        <Reveal className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} dataReveal viewTransition />
          ))}
        </Reveal>
      )}

      <nav
        className="mt-10 flex items-center justify-between"
        aria-label="Navigasi halaman"
      >
        {params.page && params.page > 1 ? (
          <Link href={buildHref(params, { page: params.page - 1 })} className={pageBtn}>
            ← Sebelumnya
          </Link>
        ) : (
          <span className={`${pageBtn} pointer-events-none opacity-40`}>
            ← Sebelumnya
          </span>
        )}
        <span className="text-sm text-muted">Halaman {params.page ?? 1}</span>
        {hasNext ? (
          <Link href={buildHref(params, { page: (params.page ?? 1) + 1 })} className={pageBtn}>
            Selanjutnya →
          </Link>
        ) : (
          <span className={`${pageBtn} pointer-events-none opacity-40`}>
            Selanjutnya →
          </span>
        )}
      </nav>
    </div>
  );
}

const chip = (active: boolean) =>
  `rounded-full border px-3 py-1.5 text-xs font-medium transition ${
    active
      ? "border-accent bg-accent/15 text-accent-text"
      : "border-line text-muted hover:border-accent/50 hover:text-foreground"
  }`;

const pageBtn =
  "rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent-text";
