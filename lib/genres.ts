const LABELS: Record<string, string> = {
  Action: "Aksi",
  Adventure: "Petualangan",
  Comedy: "Komedi",
  Drama: "Drama",
  Ecchi: "Ecchi",
  Fantasy: "Fantasi",
  Horror: "Horor",
  "Mahou Shoujo": "Mahou Shoujo",
  Mecha: "Mecha",
  Music: "Musik",
  Mystery: "Misteri",
  Psychological: "Psikologis",
  Romance: "Romansa",
  "Sci-Fi": "Sci-Fi",
  "Slice of Life": "Kehidupan Sehari-hari",
  Sports: "Olahraga",
  Supernatural: "Supranatural",
  Thriller: "Thriller",
};

export const genreLabel = (genre: string): string => LABELS[genre] ?? genre;

// F-13 — aksen "mood" per genre. Nuansa terang selaras palet
// "Morning Sunshine & Serenity" (Soft Sky Blue, Warm Sunshine, Pastel Yellow,
// Lively Mint + turunan pastel). Dipakai sebagai highlight di latar cream.
const ACCENTS: Record<string, string> = {
  Action: "#F08A6E", // oranye-merah hangat
  Adventure: "#E0A44E", // amber cerah
  Comedy: "#FFC069", // Warm Sunshine
  Drama: "#B99BD8", // lavender
  Ecchi: "#F2A0B8", // pink pastel
  Fantasy: "#9B8ED6", // ungu lembut
  Horror: "#C97A6A", // terracotta
  "Mahou Shoujo": "#F5B0D0", // sakura
  Mecha: "#79ADDC", // Soft Sky Blue
  Music: "#D98BC4", // magenta lembut
  Mystery: "#6E93C9", // biru redup
  Psychological: "#A48FD6", // violet lembut
  Romance: "#EE8FA6", // merah muda hangat
  "Sci-Fi": "#6FC9BE", // teal mint
  "Slice of Life": "#ADF7B6", // Lively Mint
  Sports: "#7EC98F", // hijau segar
  Supernatural: "#8FA6DC", // biru-ungu
  Thriller: "#D9776B", // merah bata
};

const FALLBACK = "#FFC069"; // Warm Sunshine (aksen default)

export const genreAccent = (genre?: string | null): string =>
  genre ? (ACCENTS[genre] ?? FALLBACK) : FALLBACK;

// Warna TEKS chip genre: versi gelap dari aksen agar kontras di latar terang
// (aksen mentah terlalu muda untuk teks). Tetap mempertahankan rona.
export const genreAccentText = (genre?: string | null): string =>
  `color-mix(in oklab, ${genreAccent(genre)} 55%, #2b2b26)`;

