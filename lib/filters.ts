export const FORMATS = [
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Film" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "SPECIAL", label: "Spesial" },
] as const;

export const STATUSES = [
  { value: "RELEASING", label: "Sedang Tayang" },
  { value: "FINISHED", label: "Selesai" },
  { value: "NOT_YET_RELEASED", label: "Belum Tayang" },
] as const;

export const SORTS = [
  { value: "POPULARITY_DESC", label: "Populer" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "SCORE_DESC", label: "Rating Tertinggi" },
  { value: "START_DATE_DESC", label: "Terbaru" },
  { value: "TITLE_ROMAJI", label: "A-Z" },
] as const;

export const YEARS = Array.from({ length: 45 }, (_, i) => 2026 - i);
