import type { CatalogItem, CatalogProvider } from "./types";

const ENDPOINT = "https://graphql.anilist.co";

const MEDIA_FIELDS = `
  id
  title { romaji english native }
  description(asHtml: false)
  coverImage { extraLarge large color }
  bannerImage
  averageScore
  seasonYear
  format
  status
  episodes
  genres
  isAdult
  trailer { id site }
  source
  countryOfOrigin
  popularity
  favourites
  hashtag
  synonyms
  startDate { year month day }
  endDate { year month day }
`;

type AniListFuzzyDate = {
  year: number | null;
  month: number | null;
  day: number | null;
} | null;

type AniListMedia = {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  description: string | null;
  coverImage: {
    extraLarge: string | null;
    large: string | null;
    color: string | null;
  } | null;
  bannerImage: string | null;
  averageScore: number | null;
  seasonYear: number | null;
  format: string | null;
  status: string | null;
  episodes: number | null;
  genres: string[];
  isAdult: boolean;
  trailer: { id: string | null; site: string | null } | null;
  source: string | null;
  countryOfOrigin: string | null;
  popularity: number | null;
  favourites: number | null;
  hashtag: string | null;
  synonyms: string[] | null;
  startDate: AniListFuzzyDate;
  endDate: AniListFuzzyDate;
  tags?: AniListTag[] | null;
};

type AniListTag = {
  name: string;
  rank: number;
  category: string | null;
  isMediaSpoiler: boolean;
  isGeneralSpoiler: boolean;
};

const stripHtml = (value: string | null): string | null =>
  value
    ? value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : null;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// AniList `FuzzyDate` → string ringkas "5 Jul 2019" / "Jul 2019" / "2019".
const formatDate = (date: AniListFuzzyDate): string | null => {
  if (!date?.year) return null;
  if (date.month && date.day) {
    return `${date.day} ${MONTHS[date.month - 1]} ${date.year}`;
  }
  if (date.month) return `${MONTHS[date.month - 1]} ${date.year}`;
  return String(date.year);
};

// Bersihkan Markdown ringan dari deskripsi karakter AniList → teks polos.
const cleanCharacterBio = (value: string | null): string | null => {
  if (!value) return null;
  const text = value
    .replace(/~![\s\S]*?!~/g, " ") // marker spoiler → dibuang
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [teks](url) → teks
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **tebal** → tebal
    .replace(/__([^_]+)__/g, "$1") // __miring__ → miring
    .replace(/[*_~`]/g, "") // sisa simbol format
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0 ? text : null;
};

const mapMedia = (m: AniListMedia): CatalogItem => ({
  id: m.id,
  title: m.title.english ?? m.title.romaji ?? m.title.native ?? "Tanpa judul",
  titleNative: m.title.native,
  synopsis: stripHtml(m.description),
  coverImage: m.coverImage?.extraLarge ?? m.coverImage?.large ?? "",
  bannerImage: m.bannerImage,
  coverColor: m.coverImage?.color ?? null,
  score: m.averageScore != null ? m.averageScore / 10 : null,
  year: m.seasonYear,
  format: m.format,
  status: m.status,
  episodes: m.episodes,
  genres: m.genres,
  trailerYoutubeId: m.trailer?.site === "youtube" ? m.trailer.id : null,
  source: m.source,
  country: m.countryOfOrigin,
  popularity: m.popularity,
  favourites: m.favourites,
  hashtag: m.hashtag,
  synonyms: (m.synonyms ?? []).filter((s): s is string => Boolean(s)),
  startDate: formatDate(m.startDate),
  endDate: formatDate(m.endDate),
  tags: (m.tags ?? []).map((tag) => ({
    name: tag.name,
    rank: tag.rank,
    category: tag.category,
    isMediaSpoiler: tag.isMediaSpoiler,
    isGeneralSpoiler: tag.isGeneralSpoiler,
  })),
});

async function request<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600, tags: ["anilist"] },
  });

  if (!res.ok) {
    throw new Error(`AniList request failed: ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(`AniList error: ${json.errors[0].message}`);
  }
  if (!json.data) {
    throw new Error("AniList: respons kosong");
  }
  return json.data;
}

const LIST_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, isAdult: false, sort: $sort, status: $status) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const SEARCH_QUERY = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, isAdult: false, sort: SEARCH_MATCH, search: $search) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      ${MEDIA_FIELDS}
      duration
      season
      studios(isMain: true) { nodes { name } }
      tags { name rank category isMediaSpoiler isGeneralSpoiler }
      characters(perPage: 8, sort: [ROLE, RELEVANCE]) {
        nodes { name { full } image { large } }
      }
      recommendations(perPage: 8, sort: [RATING_DESC]) {
        nodes { mediaRecommendation { ${MEDIA_FIELDS} } }
      }
      externalLinks { site url type }
      relations {
        edges {
          relationType(version: 2)
          node { id title { english romaji native } format }
        }
      }
      # versi 2 menormalkan tipe (mis. ADAPTATION/PREQUEL/SEQUEL)
      rankings { rank type context allTime season year }
      streamingEpisodes { title thumbnail site }
      nextAiringEpisode { episode }
    }
  }
`;

// Situs streaming legal yang ditampilkan tombolnya di halaman detail (F-20).
const WATCH_SITES: Record<string, string> = {
  Crunchyroll: "Crunchyroll",
  Netflix: "Netflix",
  Hulu: "Hulu",
  "Amazon Prime Video": "Prime Video",
  "Disney Plus": "Disney+",
  "Disney+": "Disney+",
  "Bilibili TV": "Bilibili",
  Bilibili: "Bilibili",
  Tubi: "Tubi",
  "YouTube": "YouTube",
  "HIDIVE": "HIDIVE",
  "iQIYI": "iQIYI",
  "VRV": "VRV",
  "Muse Asia": "Muse Asia",
  "Ani-One Asia": "Ani-One Asia",
};

const GENRE_QUERY = `
  query {
    GenreCollection
  }
`;

const CHARACTERS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      title { english romaji native }
      characters(perPage: 25, sort: [ROLE, RELEVANCE]) {
        edges {
          id
          role
          node {
            name { full }
            image { large }
            description(asHtml: false)
            gender
            age
            bloodType
            favourites
          }
          voiceActors(language: JAPANESE) { name { full } image { large } languageV2 }
        }
      }
      staff(perPage: 12, sort: [RELEVANCE]) {
        edges {
          id
          role
          node { name { full } image { large } }
        }
      }
    }
  }
`;

const DISCOVER_QUERY = `
  query ($page: Int, $perPage: Int, $genre: String, $format: MediaFormat, $status: MediaStatus, $seasonYear: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, isAdult: false, genre: $genre, format: $format, status: $status, seasonYear: $seasonYear, sort: $sort) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const list = async (
  sort: string[],
  status?: string,
  page = 1,
  perPage = 20,
): Promise<CatalogItem[]> => {
  const data = await request<{ Page: { media: AniListMedia[] } }>(LIST_QUERY, {
    page,
    perPage,
    sort,
    status,
  });
  return data.Page.media.map(mapMedia);
};

export const anilist: CatalogProvider = {
  trending: (page, perPage) =>
    list(["TRENDING_DESC"], undefined, page, perPage),
  popular: (page, perPage) =>
    list(["POPULARITY_DESC"], undefined, page, perPage),
  topRated: (page, perPage) => list(["SCORE_DESC"], undefined, page, perPage),
  upcoming: (page, perPage) =>
    list(["POPULARITY_DESC"], "NOT_YET_RELEASED", page, perPage),
  airing: (page, perPage) =>
    list(["POPULARITY_DESC"], "RELEASING", page, perPage),
  search: async (query, page = 1, perPage = 20) => {
    const data = await request<{ Page: { media: AniListMedia[] } }>(
      SEARCH_QUERY,
      { page, perPage, search: query },
    );
    return data.Page.media.map(mapMedia);
  },
  getDetail: async (id) => {
    const data = await request<{
      Media:
        | (AniListMedia & {
            duration: number | null;
            season: string | null;
            studios: { nodes: { name: string | null }[] } | null;
            characters: {
              nodes: {
                name: { full: string | null };
                image: { large: string | null } | null;
              }[];
            } | null;
            recommendations: {
              nodes: {
                mediaRecommendation: AniListMedia | null;
              }[];
            } | null;
            externalLinks: {
              site: string;
              url: string;
              type: string | null;
            }[] | null;
            relations: {
              edges: {
                relationType: string | null;
                node: {
                  id: number;
                  title: {
                    english: string | null;
                    romaji: string | null;
                    native: string | null;
                  };
                  format: string | null;
                } | null;
              }[];
            } | null;
            rankings: {
              rank: number;
              type: string;
              context: string;
              allTime: boolean;
            }[] | null;
            streamingEpisodes: {
              title: string | null;
              thumbnail: string | null;
              site: string | null;
            }[] | null;
            nextAiringEpisode: { episode: number } | null;
          })
        | null;
    }>(DETAIL_QUERY, { id });

    const media = data.Media;
    if (!media) return null;

    const base = mapMedia(media);
    return {
      ...base,
      duration: media.duration,
      season: media.season,
      studio: media.studios?.nodes?.[0]?.name ?? null,
      characters: (media.characters?.nodes ?? []).map((node) => ({
        name: node.name.full ?? "",
        image: node.image?.large ?? null,
      })),
      recommendations: (media.recommendations?.nodes ?? [])
        .map((node) => node.mediaRecommendation)
        .filter((item): item is AniListMedia => Boolean(item))
        .map(mapMedia),
      externalLinks: (media.externalLinks ?? [])
        .filter((link) => link.site in WATCH_SITES && link.url.startsWith("https://"))
        .map((link) => ({
          site: WATCH_SITES[link.site],
          url: link.url,
          type: link.type,
        })),
      relations: (media.relations?.edges ?? [])
        .filter((edge) => edge.node != null)
        .map((edge) => ({
          relationType: edge.relationType ?? "OTHER",
          id: edge.node!.id,
          title:
            edge.node!.title.english ??
            edge.node!.title.romaji ??
            edge.node!.title.native ??
            "Tanpa judul",
          format: edge.node!.format,
        })),
      rankings: (media.rankings ?? []).map((ranking) => ({
        rank: ranking.rank,
        type: ranking.type,
        context: ranking.context,
        allTime: ranking.allTime,
      })),
      streamingEpisodes: (media.streamingEpisodes ?? [])
        .filter((episode) => episode.title != null)
        .map((episode) => ({
          title: episode.title!,
          thumbnail: episode.thumbnail,
          site: episode.site,
        })),
      nextEpisode: media.nextAiringEpisode?.episode ?? null,
    };
  },
  getGenres: async () => {
    const data = await request<{ GenreCollection: string[] | null }>(
      GENRE_QUERY,
      {},
    );
    return data.GenreCollection ?? [];
  },
  getCharacters: async (id) => {
    const data = await request<{
      Media:
        | {
            title: {
              english: string | null;
              romaji: string | null;
              native: string | null;
            };
            characters: {
              edges: {
                id: number;
                role: string | null;
                node: {
                  name: { full: string | null };
                  image: { large: string | null } | null;
                  description: string | null;
                  gender: string | null;
                  age: string | null;
                  bloodType: string | null;
                  favourites: number | null;
                };
                voiceActors: {
                  name: { full: string | null };
                  image: { large: string | null } | null;
                  languageV2: string | null;
                }[];
              }[];
            } | null;
            staff: {
              edges: {
                id: number;
                role: string | null;
                node: {
                  name: { full: string | null };
                  image: { large: string | null } | null;
                };
              }[];
            } | null;
          }
        | null;
    }>(CHARACTERS_QUERY, { id });

    const media = data.Media;
    if (!media) return null;

    return {
      animeTitle:
        media.title.english ?? media.title.romaji ?? media.title.native ?? "",
      characters: (media.characters?.edges ?? []).map((edge) => ({
        id: edge.id,
        name: edge.node.name.full ?? "",
        image: edge.node.image?.large ?? null,
        role: edge.role,
        description: cleanCharacterBio(edge.node.description),
        gender: edge.node.gender,
        age: edge.node.age,
        bloodType: edge.node.bloodType,
        favourites: edge.node.favourites,
        voiceActors: (edge.voiceActors ?? []).map((va) => ({
          name: va.name.full ?? "",
          image: va.image?.large ?? null,
          language: va.languageV2,
        })),
      })),
      staff: (media.staff?.edges ?? []).map((edge) => ({
        id: edge.id,
        name: edge.node.name.full ?? "",
        image: edge.node.image?.large ?? null,
        role: edge.role,
      })),
    };
  },
  discover: async (options = {}) => {
    const { genre, format, status, year, sort, page = 1, perPage = 24 } = options;
    // AniList memperlakukan argumen bernilai `null` eksplisit (mis. seasonYear)
    // sebagai filter "tak cocok apa pun" → variabel harus dihilangkan bila kosong.
    const variables: Record<string, unknown> = {
      page,
      perPage,
      sort: sort ? [sort] : ["POPULARITY_DESC"],
    };
    if (genre) variables.genre = genre;
    if (format) variables.format = format;
    if (status) variables.status = status;
    if (year) variables.seasonYear = year;

    const data = await request<{ Page: { media: AniListMedia[] } }>(
      DISCOVER_QUERY,
      variables,
    );
    return data.Page.media.map(mapMedia);
  },
};
