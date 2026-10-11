# Jelajanime

> **Jelajahi anime, temukan ceritanya.**

Katalog anime modern berbahasa Indonesia — cepat, sinematik, dan sepenuhnya responsif. Temukan judul, lihat detail kaya (jalan cerita, fakta, karakter, rekomendasi), dan tonton trailer resmi. **Hanya menautkan sumber streaming legal** — tanpa konten bajakan.

**Live:** https://jelajanime.vercel.app

---

## Fitur

- **Beranda sinematik** — hero carousel dari 5 anime trending, latar video trailer YouTube (muted/loop), auto-rotate, indikator titik, panah navigasi, dan jeda saat hover/fokus.
- **Detail anime lengkap** — banner, poster, meta (skor, tahun, format, episode, durasi, studio, status), chip genre, sinopsis, karakter utama, dan rekomendasi.
- **Fakta & wawasan** — sumber adaptasi (manga/novel/orisinal), negara, tanggal tayang, popularitas, favorit, hashtag, tag ter-peringkat, peringkat all-time, dan serial terkait (prequel/sequel/spin-off).
- **Daftar episode** — thumbnail episode dari data AniList (opsional per judul).
- **Karakter & staf** — halaman khusus dengan bio lengkap karakter (gender, umur, golongan darah) dan seiyuu (pengisi suara Jepang); bio ber-spoiler disembunyikan secara default.
- **Pencarian instan** — command-bar di navbar (shortcut `/`), debounce 300 ms, dropdown saran dengan poster, plus halaman hasil `/search`.
- **Jelajahi / Browse** — filter genre, format (TV/OVA/ONA/Movie), status (tayang/selesai/belum), tahun, dan urutan; dilengkapi pagination.
- **Watchlist** — simpan/buang anime, tersimpan lokal di browser (`localStorage`), sinkron antar-tab, dengan halaman daftar tersendiri.
- **Trailer modal** — pemutar YouTube (`youtube-nocookie`) di dialog native, dibuka tanpa suara dengan tombol mute/unmute.
- **Tonton resmi** — tombol tautan ke layanan streaming legal (Crunchyroll, Netflix, Prime Video, Disney+, Bilibili, HIDIVE, Muse Asia, dsb.) dari `externalLinks` AniList.
- **Tema terang "Morning Sunshine & Serenity"** — palet hangat (Cream, Warm Sunshine, Soft Sky Blue, Lively Mint) dengan kontras yang diuji (WCAG AA).
- **Animasi halus** — GSAP (entrance hero, reveal saat scroll, Flip reflow watchlist) + View Transitions poster→detail; semua dinonaktifkan saat `prefers-reduced-motion`.
- **Aksesibel & responsif** — keyboard-friendly, `aria` tepat, dari ponsel 360 px hingga desktop.
- **State lengkap** — skeleton loading, empty state, halaman 404 & error yang ramah.
- **SEO & share** — metadata dinamis, OG image yang di-generate, favicon kustom.

---

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack, Cache Components/PPR, Partial Prefetching) |
| UI | **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v4** (token via `@theme`, CSS variables) |
| Animasi | **GSAP 3** + `@gsap/react` (`ScrollTrigger`, `SplitText`, `Flip`) |
| Data | **AniList GraphQL API** (gratis, tanpa API key) |
| Gambar | `next/image` (remote pattern `s4.anilist.co`) |
| Font | `next/font` — Bebas Neue (display) + Inter (body) |
| State klien | `localStorage` via `useSyncExternalStore` (watchlist) |
| Deploy | **Vercel** (auto-deploy dari GitHub) |

---

## Arsitektur Singkat

```
app/                 # Route App Router (home, /browse, /search, /watchlist, /anime/[id], …)
components/
  layout/            # Navbar (kapsul melayang), mega-menu, footer
  anime/             # Hero carousel, kartu, trailer modal, watchlist, dsb.
  browse/ search/ ui/ anim/
lib/
  providers/         # Interface CatalogProvider + adapter AniList
  genres.ts gsap.ts filters.ts watchlist.tsx
config/site.ts       # Nama, tagline, deskripsi, URL
```

- **Provider-agnostik** — antarmuka `CatalogProvider` memisahkan UI dari sumber data; adapter `anilist` adalah implementasi default. Menambah sumber lain = membuat adapter baru.
- **Server-side fetch** dengan ISR (`revalidate`) dan tag cache.
- **Normalisasi data** di layer provider (skor 0–100 → 0–10, pembersihan HTML/Markdown, format tanggal, filter tautan `https`).

---

## Menjalankan Lokal

```bash
npm install      # .npmrc sudah mengatasi allow-scripts
npm run dev      # http://localhost:3000
npm run lint     # eslint
npm run typecheck
npm run build
```

Opsional — buat `.env.local` dari `.env.example`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Di Vercel, URL produksi terdeteksi otomatis (fallback ke `VERCEL_PROJECT_PRODUCTION_URL`).

---

## Lisensi & Atribusi

Data anime berasal dari **[AniList](https://anilist.co)**. Jelajanime tidak berafiliasi dengan AniList. Proyek ini **tidak** meng-host atau menyalurkan video berhak cipta; tautan tonton mengarah ke layanan resmi berlisensi.
