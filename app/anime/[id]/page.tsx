import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimeRow } from "@/components/anime/AnimeRow";
import { TrailerModal } from "@/components/anime/TrailerModal";
import { WatchlistButton } from "@/components/anime/WatchlistButton";
import { ShareButton } from "@/components/anime/ShareButton";
import { SpoilerText } from "@/components/anime/SpoilerText";
import { IconExternal } from "@/components/icons";
import { catalog } from "@/lib/providers";
import { genreAccent, genreAccentText, genreLabel } from "@/lib/genres";

export const instant = false;

const STATUS: Record<string, string> = {
  FINISHED: "Selesai",
  RELEASING: "Sedang tayang",
  NOT_YET_RELEASED: "Belum tayang",
  CANCELLED: "Batal",
  HIATUS: "Hiatus",
};

const SOURCE: Record<string, string> = {
  ORIGINAL: "Karya orisinal",
  MANGA: "Manga",
  LIGHT_NOVEL: "Light novel",
  VISUAL_NOVEL: "Visual novel",
  VIDEO_GAME: "Video game",
  NOVEL: "Novel",
  DOUJINSHI: "Doujinshi",
  ANIME: "Anime",
  WEB_NOVEL: "Web novel",
  LIVE_ACTION: "Live action",
  GAME: "Game",
  COMIC: "Komik",
  MULTIMEDIA_PROJECT: "Proyek multimedia",
  PICTURE_BOOK: "Buku bergambar",
};

const RELATION: Record<string, string> = {
  PREQUEL: "Prequel",
  SEQUEL: "Sequel",
  SOURCE: "Sumber",
  ADAPTATION: "Adaptasi",
  SIDE_STORY: "Cerita sampingan",
  SPIN_OFF: "Spin-off",
  ALTERNATIVE: "Alternatif",
  PARENT: "Induk",
  SUMMARY: "Ringkasan",
  CHARACTER: "Karakter",
  OTHER: "Lainnya",
};

const RELATION_ORDER = [
  "PREQUEL",
  "SEQUEL",
  "SIDE_STORY",
  "SPIN_OFF",
  "ALTERNATIVE",
  "SOURCE",
  "ADAPTATION",
  "SUMMARY",
  "PARENT",
  "OTHER",
];

const RANK_LABEL: Record<string, string> = {
  RATED: "Rating",
  POPULAR: "Populer",
};

const formatCount = (n: number): string =>
  new Intl.NumberFormat("id-ID", { notation: "compact" }).format(n);

const load = async (id: string) => {
  const numeric = Number(id);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  try {
    return await catalog.getDetail(numeric);
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: PageProps<"/anime/[id]">): Promise<Metadata> {
  const { id } = await params;
  const anime = await load(id);
  return { title: anime?.title ?? "Anime" };
}

export default async function AnimeDetailPage({
  params,
}: PageProps<"/anime/[id]">) {
  const { id } = await params;
  const anime = await load(id);
  if (!anime) notFound();

  const backdrop = anime.bannerImage ?? anime.coverImage;
  const mood = genreAccent(anime.genres[0]);
  const facts = [
    anime.score ? `★ ${anime.score.toFixed(1)}` : null,
    anime.year ? String(anime.year) : null,
    anime.format,
    anime.episodes ? `${anime.episodes} episode` : null,
    anime.duration ? `${anime.duration} menit` : null,
    anime.studio,
    anime.season ? `Season ${anime.season}` : null,
    anime.status ? STATUS[anime.status] ?? anime.status : null,
  ].filter((item): item is string => Boolean(item));

  // Tags publik (tanpa spoiler umum), terurut peringkat.
  const spoilerTags = (anime.tags ?? []).filter((tag) => tag.isMediaSpoiler);
  const tags = (anime.tags ?? [])
    .filter((tag) => !tag.isGeneralSpoiler && !tag.isMediaSpoiler)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 14);

  // Relasi diurutkan sesuai makna (prequel/sequel dulu), dedup per id.
  const seenRelations = new Set<number>();
  const relations = [...anime.relations]
    .sort(
      (a, b) =>
        RELATION_ORDER.indexOf(a.relationType) -
        RELATION_ORDER.indexOf(b.relationType),
    )
    .filter((rel) => {
      if (seenRelations.has(rel.id)) return false;
      seenRelations.add(rel.id);
      return true;
    });

  const rankings = anime.rankings.filter((ranking) => ranking.allTime);

  // Fakta tambahan (baris "Fakta") — label + nilai.
  const extraFacts = ([
    anime.source
      ? { label: "Sumber", value: SOURCE[anime.source] ?? anime.source }
      : null,
    anime.country
      ? { label: "Negara", value: anime.country === "JP" ? "Jepang" : anime.country }
      : null,
    anime.startDate ? { label: "Mulai tayang", value: anime.startDate } : null,
    anime.endDate ? { label: "Selesai", value: anime.endDate } : null,
    anime.popularity != null
      ? { label: "Popularitas", value: `${formatCount(anime.popularity)} penggemar` }
      : null,
    anime.favourites != null && anime.favourites > 0
      ? { label: "Favorit", value: formatCount(anime.favourites) }
      : null,
  ].filter(Boolean) as { label: string; value: string }[]);

  return (
    <div style={{ "--mood": mood } as React.CSSProperties}>
      <section className="relative -mt-20 h-[46vh] min-h-[320px] w-full overflow-hidden">
        {backdrop ? (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          // Tanpa banner: latar gradient berbasis mood genre (bukan cover poster).
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 120% at 15% 0%, color-mix(in oklab, ${mood} 30%, transparent), transparent 60%), var(--color-scrim)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/60 to-scrim/25" />
        {/* Fade dasar banner ke warna halaman agar menyatu (tema terang). */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
        <span className="film-grain" aria-hidden />
        <span className="edge-spotlight" aria-hidden />
        {/* Garis aksen "mood" genre di dasar banner — pengganti blob glow. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1"
          style={{
            background: `linear-gradient(to right, ${mood}, transparent 70%)`,
          }}
        />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {anime.coverImage ? (
            <Image
              src={anime.coverImage}
              alt={anime.title}
              width={460}
              height={650}
              priority
              sizes="(max-width: 640px) 176px, 240px"
              className="-mt-24 h-auto w-44 shrink-0 self-start rounded-xl ring-1 ring-line sm:-mt-28 sm:w-60"
            />
          ) : null}
          <div className="min-w-0 pb-1">
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted"
            >
              <Link href="/" className="transition hover:text-accent-text">
                Beranda
              </Link>
              <span aria-hidden>/</span>
              {anime.genres[0] ? (
                <>
                  <Link
                    href={`/browse?genre=${encodeURIComponent(anime.genres[0])}`}
                    className="transition hover:text-accent-text"
                  >
                    {genreLabel(anime.genres[0])}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              ) : null}
              <span className="truncate text-foreground/80">
                {anime.title}
              </span>
            </nav>
            <h1 className="font-display text-4xl leading-none tracking-wide sm:text-6xl">
              {anime.title}
            </h1>
            {anime.titleNative ? (
              <p className="mt-2 text-sm text-muted">{anime.titleNative}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              {facts.map((fact, index) => (
                <span key={fact} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span className="h-1 w-1 rounded-full bg-line" />
                  ) : null}
                  <span>{fact}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {anime.genres.map((genre) => (
            <Link
              key={genre}
              href={`/browse?genre=${encodeURIComponent(genre)}`}
              className="rounded-full border px-3 py-1.5 text-xs transition hover:brightness-125"
              style={{
                borderColor: `${genreAccent(genre)}66`,
                color: genreAccentText(genre),
                backgroundColor: `${genreAccent(genre)}1a`,
              }}
            >
              {genreLabel(genre)}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WatchlistButton entry={anime} className="px-5 py-2.5" />
          {anime.trailerYoutubeId ? (
            <TrailerModal
              youtubeId={anime.trailerYoutubeId}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-foreground transition hover:border-accent/50 hover:text-accent-text"
            />
          ) : null}
          <ShareButton title={anime.title} />
        </div>

        {anime.externalLinks.length > 0 ? (
          <section className="mt-6">
            <h2 className="font-display text-lg tracking-wide text-muted">
              Tonton Resmi
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {anime.externalLinks.map((link) => (
                <a
                  key={`${link.site}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-foreground transition hover:brightness-110"
                >
                  {link.site}
                  <IconExternal
                    width={14}
                    height={14}
                    className="h-3.5 w-3.5"
                  />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {anime.synopsis ? (
          <p className="mt-6 max-w-3xl leading-relaxed text-foreground/90">
            {anime.synopsis}
          </p>
        ) : null}

        {extraFacts.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-lg tracking-wide text-muted">
              Fakta
            </h2>
            <dl className="mt-3 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {extraFacts.map((fact) => (
                <div key={fact.label} className="text-sm">
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-foreground/90">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {anime.hashtag ? (
              <p className="mt-3 text-sm text-muted">{anime.hashtag}</p>
            ) : null}
          </section>
        ) : null}

        {tags.length > 0 || spoilerTags.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-lg tracking-wide text-muted">
              Tag
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.name}
                  className="rounded-full bg-surface/60 px-3 py-1 text-xs text-foreground/80 ring-1 ring-line"
                >
                  {tag.name}
                </span>
              ))}
              {spoilerTags.length > 0 ? (
                <SpoilerText label="Lihat tag spoiler">
                  <span className="flex flex-wrap gap-2">
                    {spoilerTags.map((tag) => (
                      <span
                        key={tag.name}
                        className="rounded-full bg-surface/60 px-3 py-1 text-xs text-foreground/80 ring-1 ring-line"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </span>
                </SpoilerText>
              ) : null}
            </div>
          </section>
        ) : null}

        {rankings.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-lg tracking-wide text-muted">
              Peringkat
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {rankings.map((ranking) => (
                <li
                  key={`${ranking.type}-${ranking.context}`}
                  className="flex items-center gap-2"
                >
                  <span className="font-display text-2xl text-accent-text">
                    #{ranking.rank}
                  </span>
                  <span className="text-muted">
                    {RANK_LABEL[ranking.type] ?? ranking.type} · {ranking.context}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {relations.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-lg tracking-wide text-muted">
              Serial Terkait
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relations.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/anime/${rel.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/40 px-4 py-3 transition hover:border-accent/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium group-hover:text-accent-text">
                      {rel.title}
                    </span>
                    <span className="text-xs text-muted">
                      {RELATION[rel.relationType] ?? rel.relationType}
                      {rel.format ? ` · ${rel.format}` : ""}
                    </span>
                  </span>
                  <span aria-hidden className="text-muted transition group-hover:text-accent-text">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {anime.streamingEpisodes.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-lg tracking-wide text-muted">
              Episode
            </h2>
            <p className="mt-2 text-xs text-muted">
              Daftar episode. Pemutaran tetap mengikuti tautan resmi di atas.
            </p>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-3">
              {anime.streamingEpisodes.map((episode, index) => (
                <figure
                  key={`${episode.title}-${index}`}
                  className="w-56 shrink-0"
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-2 ring-1 ring-line">
                    {episode.thumbnail ? (
                      <Image
                        src={episode.thumbnail}
                        alt={episode.title}
                        fill
                        sizes="224px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-display text-3xl text-muted">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <figcaption className="mt-2 line-clamp-2 text-xs text-muted">
                    {episode.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {anime.nextEpisode ? (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface/60 px-4 py-1.5 text-sm text-accent-text ring-1 ring-accent/30">
            Episode {anime.nextEpisode} segera tayang
          </p>
        ) : null}

        {anime.characters.length > 0 ? (
          <section className="mt-10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
                Karakter Utama
              </h2>
              <Link
                href={`/anime/${anime.id}/characters`}
                className="shrink-0 text-sm text-muted transition hover:text-accent-text"
              >
                Lihat semua →
              </Link>
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-3">
              {anime.characters.map((character) => (
                <figure
                  key={character.name}
                  className="w-24 shrink-0 text-center"
                >
                  {character.image ? (
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full object-cover ring-1 ring-line"
                    />
                  ) : (
                    <span className="block h-24 w-24 rounded-full bg-surface-2 ring-1 ring-line" />
                  )}
                  <figcaption className="mt-2 text-xs text-muted">
                    {character.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      {anime.recommendations.length > 0 ? (
        <div className="mt-14">
          <AnimeRow title="Mirip Dengan Ini" items={anime.recommendations} />
        </div>
      ) : null}
    </div>
  );
}
