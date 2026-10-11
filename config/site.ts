const resolveUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Di Vercel: pakai domain produksi otomatis bila env belum diisi.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const site = {
  name: "Jelajanime",
  tagline: "Jelajahi anime, temukan ceritanya.",
  description:
    "Jelajanime — katalog anime modern berbahasa Indonesia. Jelajahi judul, lihat jalan cerita, dan tonton trailer resmi.",
  url: resolveUrl(),
} as const;
