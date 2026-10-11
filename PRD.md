# PRD — Jelajanime

**Metadata dokumen**
- Produk: **Jelajanime** — "Jelajahi anime, temukan ceritanya."
- Versi: 0.3 · Status: aktif (MVP dibangun)
- Sumber kebenaran workflow: dokumen ini (`PRD.md`)
- Repo: `F:\aplikasi\movie`, package `jelajanime`

## 1. Visi
Jelajanime adalah web katalog anime modern berbahasa Indonesia dengan pengalaman menjelajah yang cepat, sinematik, dan responsif. Pengguna menemukan judul, melihat detail kaya, dan menonton trailer resmi — semua dalam antarmuka gelap yang rapi.

## 2. Goals & Non-Goals
**Goals:** katalog anime yang cepat & rapi; detail lengkap; pencarian instan; watchlist; animasi halus; dark cinematic; sepenuhnya responsif; aksesibel; **menonton lewat sumber legal resmi** (tautan resmi dari provider + video YouTube kanal berlisensi).

**Non-Goals:** meng-host/menyalurkan video berhak cipta tanpa lisensi; **mengintegrasikan situs/API bajakan** (mis. lk21, Otakudesu, Samehadaku, GogoAnime, Zoro/AniWatch); membangun sistem transcode/CDN; bukan layanan berlangganan.

## 3. Persona
Pencinta anime kasual yang ingin cepat menemukan judul & melihat trailer; bahasa utama Indonesia; mengakses dari ponsel dan desktop.

## 4. Scope per Milestone
- **MVP:** katalog + detail + pencarian + browse genre + watchlist lokal + trailer + **tautan tonton resmi**. Tanpa DB, tanpa auth.
- **v1:** filter format/status lanjutan, halaman karakter/staff, auth (Auth.js) + Postgres, watchlist per-user, profil, genre mood accent.
- **v2:** rekomendasi, player video legal (karya domain-publik/CC), lanjut-tonton, rating/review, i18n EN, PWA.

## 5. Daftar Fitur (ID)
| ID | Fitur | Milestone | Status |
|----|-------|-----------|--------|
| F-01 | Home (hero carousel featured — gambar + video trailer YouTube muted/loop, auto-rotate, dot indikator; baris Trending/Populer/Rating/Upcoming) | MVP | done |
| F-02 | Detail anime (banner, meta, genre, skor, episode, sinopsis, karakter, rekomendasi, **fakta: sumber/negara/tanggal tayang/popularitas/favorit, tag ter-rank, peringkat all-time, serial terkait, daftar episode**) | MVP | done |
| F-03 | Pencarian (debounce) | MVP | done |
| F-04 | Browse/Genre (filter genre, format, tahun, status, sort, pagination) | MVP | done |
| F-05 | Watchlist (add/remove, halaman daftar) — `localStorage` | MVP | done |
| F-06 | Shell (navbar kapsul melayang transparan→frost, mega-menu kategori glass, search command-bar inline, footer atribusi AniList, skeleton loading) | MVP | done |
| F-07 | Trailer modal (YouTube dialog) | MVP | done |
| F-08 | State: 404 / error / empty | MVP | done |
| F-09 | Filter format & status (TV/OVA/ONA/Movie; airing/finished) | v1 | done |
| F-10 | Halaman karakter/staff (+ **bio lengkap karakter: gender, umur, gol. darah** dari `Character.description`) | v1 | done |
| F-11 | Auth (Google + email magic-link) | v1 | planned |
| F-12 | Watchlist per-user + profil (Postgres) | v1 | planned |
| F-13 | Genre mood accent (palet per genre) | v1 | done |
| F-14 | Rekomendasi anime | v2 | planned |
| F-15 | Player video **legal** (YouTube kanal berlisensi: Muse Asia/Ani-One; karya domain-publik/CC) | v2 | planned |
| F-16 | Lanjut-tonton | v2 | planned |
| F-17 | Rating/review | v2 | planned |
| F-18 | i18n (EN) | v2 | planned |
| F-19 | Tombol Kategori di navbar (dropdown genre dari AniList `GenreCollection`) → `/browse?genre=` | MVP | done |
| F-20 | Tautan Tonton Resmi di detail (AniList `externalLinks`: Crunchyroll/Netflix/YouTube/dsb) | MVP | done |

## 6. Tech Stack & Arsitektur
- **Next.js 16 (App Router) + React 19.3 + TypeScript strict**; Server Components; ISR.
- **Tailwind CSS v4** (config CSS-first) + **Radix primitives** seperlunya (bukan full shadcn).
- **GSAP 3** (core + `ScrollTrigger`/`SplitText`/`Flip`, via `@gsap/react`) + **View Transitions** native (React `<ViewTransition>`).
- **npm**; ESLint + Prettier (tanpa Husky).
- Data: **AniList GraphQL** (`graphql.anilist.co`, tanpa key). Dirender server-side + cache ISR; pencarian via Route Handler.
- Deploy: **Vercel**.
- v1 tambahan: **Auth.js (NextAuth v5)**, **Postgres (Neon)**, **Drizzle ORM**.

## 7. Design Token
- 2 lapis (primitive → semantic) via CSS variables.
- **Tema terang — palet "Morning Sunshine & Serenity"**: latar `--color-ink` = Cream White `#FCF5C7`; surface `#FFFFFF`; surface-2 `#FFF7DA`; border `#E7DEB4`; teks `--color-foreground` `#2B2B26`; muted `#7B7460`.
- Aksen: primary `--color-accent` = **Warm Sunshine** `#FFC069` (untuk bg/border); `--color-accent-text` = `#8A5518` (oranye tua — khusus **teks** di latar terang); secondary `--color-accent-deep` = **Sky Dark** `#235C8F`; tambahan `--color-mint` = **Lively Mint** `#ADF7B6`.
- `--color-muted` = `#6E6755` (kontras AA di cream).
- Token khusus `--color-scrim` `#1A1712` (tetap gelap) — dipakai sebagai *scrim* agar teks putih tetap terbaca di atas gambar/banner (hero, poster, header saat di atas hero).
- Font `next/font`: display **Bebas Neue**, body **Inter**.
- Genre mood accent = F-13 (v1) — warna terang selaras palet.

## 8. Spesifikasi Animasi
- **GSAP 3 (gratis penuh) + `@gsap/react`**: plugin `ScrollTrigger`, `SplitText`, `Flip`. Registrasi di `lib/gsap.ts`. Semua efek dilewati saat `prefers-reduced-motion: reduce`.
  - **Hero entrance timeline**: `SplitText` (chars) pada judul + stagger meta/sinopsis/tombol tiap slide aktif (`HeroCarousel`).
  - **Reveal katalog**: `Reveal` (`components/anim/Reveal.tsx`) — ScrollTrigger `once`, stagger anak `[data-reveal]`, dipakai di baris home & grid browse/search.
  - **Flip**: reflow halus kartu `/watchlist` saat entri dihapus.
  - Hover kartu tetap CSS (zoom + ring glow) — tilt berbasis JS per-kartu sengaja dihindari demi budget performa.
- **View Transitions (React `<ViewTransition>`):** shared-element poster→detail via `name={`poster-${id}`}`. **Hanya** pada konteks unik (grid browse/search → poster detail) untuk menghindari nama duplikat. Overlay `pointer-events: none`; dimatikan saat reduced-motion.
- **Carousel hero:** auto-rotate 8s + dot + panah, pause saat hover/fokus, hormati reduced-motion.

## 9. Data & Provider
- Interface `CatalogProvider` (`trending`, `popular`, `topRated`, `upcoming`, `airing`, `search`, `getById`).
- Impl `anilist` (default, GraphQL, tanpa key). Slot provider `custom` tetap netral (isi env manual) — tanpa endpoint pihak bajakan.
- Semua request server-side, cache ISR (`revalidate`). Gambar via `next/image` (`remotePatterns: s4.anilist.co`).
- Normalisasi: skor AniList (0–100) → 0–10; `trailer.site === "youtube"` → id embed; `description` dibersihkan dari HTML.
- Field AniList tambahan untuk F-02: `source`, `countryOfOrigin`, `popularity`, `favourites`, `hashtag`, `synonyms`, `startDate`/`endDate` (FuzzyDate → teks), `tags` (name/rank/category/spoiler), `relations` (relationType v2: PREQUEL/SEQUEL/SOURCE/…), `rankings` (all-time), `streamingEpisodes`, `nextAiringEpisode`.
- F-10: `Character.description` dibersihkan dari Markdown + marker spoiler `~!...!~`; ditambah `gender`/`age`/`bloodType`/`favourites`. Tag ber-spoiler disembunyikan default di UI (`SpoilerText`).

## 10. Environment Variables
`.env.example` (di-commit, nama saja) · `.env.local` (gitignore):
- `NEXT_PUBLIC_SITE_URL=`
- `CUSTOM_API_BASE_URL=` (opsional, slot netral isi-manual)
- `CUSTOM_API_TOKEN=` (opsional, slot netral isi-manual)

## 11. Peta Route
`/` · `/anime/[id]` · `/anime/[id]/characters` · `/search?q=` · `/browse?genre=&format=&status=&year=&sort=&page=` · `/watchlist` · route handler `/api/search`.

## 12. Budget Performa & A11y
- LCP < 2.5s, CLS < 0.1, INP < 200ms; gambar lazy + ukuran tepat; JS klien minimal.
- Fokus keyboard terlihat; label ARIA; kontras AA; dukung `prefers-reduced-motion`.
- Font dioptimalkan `next/font` (no layout shift).

## 13. Milestone & Kriteria Selesai
- **MVP selesai bila:** F-01..F-08 jalan, build produksi lolos `lint`+`typecheck`, Lighthouse mobile >= 90, responsif 360–1920px, tanpa error runtime.
- **v1:** F-09..F-13 + migrasi watchlist ke DB saat login.
- **v2:** F-14..F-18.

## 14. Protokol Perubahan Fitur (WAJIB)
1. Tidak ada tambah/hapus/ubah fitur tanpa persetujuan eksplisit pengguna.
2. Sebelum perubahan: ajukan diff ke PRD (fitur baru + ID + alasan).
3. Setelah disetujui: update bagian 5 + catat di Changelog (tanggal, ID, alasan).
4. Status fitur: `planned -> in-progress -> done`.

## 15. Changelog
- 2026-10-10 — PRD v0.1 dibuat. Keputusan Q1–Q20 dicatat. Sumber data awal = **TMDB** (+ slot provider `custom` netral). Playback = trailer resmi; film domain-publik via Internet Archive (v2). Integrasi API bajakan dikecualikan (Non-Goals).
- 2026-10-11 — PRD v0.2. **Sumber data diganti TMDB → AniList** dan konten film → anime (arahan pengguna). Alasan: Jikan (pilihan pengguna) shutdown 1 Okt 2026; AniList gratis, tanpa key, dan terverifikasi reachable. Atribusi TMDB → AniList. Feature ID disesuaikan (F-02/F-04/F-09/F-10 dst) tanpa menambah/menghapus fitur.
- 2026-10-11 — Tokens: aksen gold `#E5B567` diganti ke **Wada Sanzo Combination #22** — primary `#FFF200` (Yellow), secondary `#1C4286` (Deep Lyons Blue). Hex Wada dipertahankan apa adanya (tanpa desaturasi/perubahan). Aturan: hover pakai `brightness`, bukan hex baru.
- 2026-10-11 — Fitur baru **F-19** (arahan pengguna): tombol **Kategori** di navbar dengan dropdown genre yang diambil dari AniList `GenreCollection`; memilih genre membuka `/browse?genre=`. Menyertakan halaman browse dasar (populer/all + grid genre), memulai **F-04**. Tersedia API relevan (query `GenreCollection` + argumen `genre` pada `Page.media`) — tidak perlu filter fiktif.
- 2026-10-11 — **Rebrand NontonKuy → Nexusnime** (arahan pengguna, F-06): nama di `config/site.ts`, header, footer, metadata/`title`, `package.json`, README, dan dokumen ini. Logo asli pengguna (`public/logo.png`, PNG transparan) dipakai di header + footer; `app/icon.png` (favicon) dibuat dari logo yang sama, `app/favicon.ico` bawaan dihapus. Nama domain/`NEXT_PUBLIC_SITE_URL` tidak berubah.
- 2026-10-11 — **F-01 done, F-02 selesai**: `/anime/[id]` (banner, poster, meta, genre chip → browse, sinopsis, karakter, rekomendasi, 404 bila id salah/API gagal). Provider: `getById` → `getDetail` (satu query AniList dengan `characters` + `recommendations`). Kartu katalog kini jadi link ke detail.
- 2026-10-11 — **PRD v0.3**: "menonton lewat sumber legal resmi" masuk **Goals**. Fitur baru **F-20** (tautan tonton resmi dari AniList `externalLinks`, di halaman detail). **F-15** diperluas: player YouTube kanal berlisensi (Muse Asia, Ani-One) + karya domain-publik. **Non-Goals diperkuat**: scraping situs bajakan (Otakudesu, Samehadaku, GogoAnime, Zoro/AniWatch, lk21) dikecualikan.
- 2026-10-11 — **Perbaikan dokumen**: Non-Goals dipulihkan (sempat tertukar menjadi Goals). Baris tabel F-15 diperbaiki yang sempat terpotong. Sumber player F-15 dipertegas = legal (domain-publik/CC).
- 2026-10-11 — **F-20 done**: `externalLinks` AniList ditambahkan ke `getDetail` (`DetailItem.externalLinks`). Halaman `/anime/[id]` menampilkan baris tombol "Tonton Resmi" ke situs legal (Crunchyroll, Netflix, Hulu, Prime Video, Disney+, Bilibili, Tubi, YouTube, HIDIVE, iQIYI, Muse Asia, Ani-One Asia). Hanya tautan `https` yang ditampilkan; sumber bajakan tetap dikecualikan (Non-Goals).
- 2026-10-11 — **F-07 done**: komponen `TrailerModal` (client, `<dialog>` native, embed `youtube-nocookie`) dipakai di tombol hero "Tonton Trailer" dan tombol trailer di `/anime/[id]`. Esc/backdrop menutup; muncul hanya bila `trailerYoutubeId` ada.
- 2026-10-11 — **F-03 done**: halaman `/search?q=` (grid hasil + state kosong/awal) + route handler `/api/search` (JSON ringan). `SearchBar` client: debounce 300ms, saran dropdown (poster mini), submit ke `/search`, klik saran → detail. Ikon cari di navbar mengarah ke `/search`.
- 2026-10-11 — **F-05 done**: `lib/watchlist.tsx` store `localStorage` via `useSyncExternalStore` (tanpa provider; event `storage` ikut tersinkron antar-tab). `WatchlistButton` di hero & detail; halaman `/watchlist` (grid + hapus + empty state). Kunci: `nexusnime:watchlist`.
- 2026-10-11 — **F-06 done**: shell responsif (navbar + footer atribusi AniList sudah ada); ditambah skeleton loading (`components/ui/Skeleton.tsx`, `app/loading.tsx`, `app/browse/loading.tsx`, `app/search/loading.tsx`).
- 2026-10-11 — **F-08 done**: `app/not-found.tsx` (404 ramah) + `app/error.tsx` (batas error dengan tombol "Coba Lagi"); `notFound()` dipakai bila id anime tidak valid/gagal.
- 2026-10-11 — **F-04 done**: `discover` diperluas (`DiscoverOptions`: genre/format/status/year/sort/page/perPage). Halaman `/browse` kini punya chip genre + filter Format/Status/Tahun/Urutkan (URL-driven) + pagination. **Perbaikan bug**: variabel GraphQL kosong tidak lagi dikirim sebagai `null` (AniList memperlakukan `null` eksplisit sebagai filter kosong → 0 hasil); variabel dihilangkan bila tidak dipakai.
- 2026-10-11 — **F-13 done**: aksen "mood" per genre (`genreAccent()` di `lib/genres.ts`, 18 genre, nuansa Wada Sanzo jenuh; fallback kuning `#FFF200`). Dipakai di `/browse` (glow judul + chip genre aktif) dan `/anime/[id]` (glow banner + chip genre berwarna via border/teks/isi `hex`+alpha). Token inti `--color-accent`/`--color-accent-deep` tidak diubah.
- 2026-10-11 — **F-09 done**: `FilterBar` (`components/browse/FilterBar.tsx`) menggantikan select inline — grup filter berlabel (Format/Status/Tahun/Urutkan), indikator filter aktif, dan tautan "Reset filter (n)". Nilai sesuai spek (TV/OVA/ONA/Film; Sedang Tayang/Selesai/Belum Tayang). `FilterSelect.tsx` lama dihapus.
- 2026-10-11 — **F-10 done**: provider `getCharacters(id)` (query `characters` + `voiceActors(language: JAPANESE)` + `staff`) → tipe `CharactersResult`/`CharacterEdge`/`StaffMember`/`VoiceActor`. Route baru `/anime/[id]/characters` (grid karakter + seiyuu + staf, dengan backlink). Tautan "Lihat semua →" di detail (`/anime/[id]`).
- 2026-10-11 — **F-06 overhaul (navbar)**: navbar baru gaya kapsul melayang (`components/layout/NavShell.tsx`) — transparan di atas, berubah frosted-glass saat scroll (lapisan frost `absolute -z-10` terpisah, transisi `opacity`, hormati `prefers-reduced-motion`). Arah desain: scroll-transparent→frost + mega-menu glass + strip minimal (underline aksen hanya untuk item aktif). **Kategori** jadi mega-menu (`MegaMenu.tsx`) buka via hover + `:focus-within` (keyboard), panel `bg-surface/95` tanpa `backdrop-blur` (hindari double-blur). **Search command-bar inline** (`components/search/NavSearch.tsx`) dengan shortcut `/`. Hero home & banner `/anime/[id]` di-tuck (`-mt-20`) di bawah navbar; `main` diberi `pt-20`. `SiteNav.tsx`/`GenreMenu.tsx` dihapus.
- 2026-10-11 — **F-01 (hero video)**: Hero home dapat latar **video trailer** via `components/anime/HeroVideo.tsx` (iframe `youtube-nocookie`, `autoplay&mute&loop`, tanpa kontrol, cover penuh). Fallback ke gambar banner/cover bila anime tanpa trailer (mis. ONE PIECE) dan saat `prefers-reduced-motion: reduce`. Iframe hanya dirender client-side (hemat beban). Catatan: AniList menyediakan **satu** field `trailer` per entri (bukan daftar) — itu sebabnya hanya ada satu trailer.
- 2026-10-11 — **F-07 (audio)**: `TrailerModal` dibuka dalam keadaan **mute** (`&mute=1`) agar tidak ada bunyi mendadak. Kontrol suara: **tombol Mute/Unmute sendiri** di header modal (kontrol iframe via YouTube IFrame API `postMessage`, `enablejsapi=1`) + `controls=1` sebagai jaminan fallback. Penutupan modal mereset ke mute.- 2026-10-11 — **F-01 (hero carousel)**: Hero home jadi **carousel** (`components/anime/HeroCarousel.tsx`) dari 5 anime trending — auto-rotate 8 detik, dot indikator, pause saat hover/fokus, dan nonaktif saat `prefers-reduced-motion`. Tiap slide: gambar banner/cover + video trailer (khusus slide aktif, hemat beban) + judul/meta/sinopsis + tombol Trailer & Watchlist. `Hero.tsx` lama dihapus. AniList tetap hanya menyediakan satu `trailer` per entri, jadi video per slide mengikuti field itu.
- 2026-10-11 — **Penyempurnaan desain/anima (arahan pengguna)**: (1) **Ikon terpusat** di `components/icons.tsx`, menggantikan SVG inline (NavShell, MegaMenu, NavSearch, TrailerModal, detail). (2) **`EmptyState`** seragam (`components/ui/EmptyState.tsx`) dipakai di search/browse/watchlist. (3) **View Transitions** shared-element poster→detail via React `<ViewTransition>` (tanpa flag config); `::view-transition { pointer-events: none }` + guard reduced-motion. (4) **`.reveal`** (CSS `animation-timeline: view()`) di baris & grid katalog. (5) **Filter mobile kolaps** (tombol "Filter (n)") di `FilterBar`. (6) **`app/opengraph-image.tsx`** (OG image) dibuat via `next/og`; `cdn.myanimelist.net` dihapus dari `remotePatterns`. (7) **Carousel panah** kiri/kanan + strip fade bawah hero. (8) **Tombol Bagikan** (`ShareButton`, Web Share API + fallback copy) dan **breadcrumb** di detail.
- 2026-10-11 — **GSAP dituntaskan**: dependency `gsap@3.15` + `@gsap/react`, `lib/gsap.ts` (register `ScrollTrigger`/`SplitText`/`Flip`, + helper `prefersReducedMotion`). Efek: entrance timeline hero (`SplitText` judul + stagger), reveal ScrollTrigger (`components/anim/Reveal.tsx`) menggantikan `.reveal` CSS, dan Flip reflow watchlist. **Perbaikan**: hapus `ViewTransition` ber-nama dari kartu baris home (anime bisa muncul di >1 baris → `view-transition-name` duplikat, memicu error transisi); morph kini hanya di grid browse/search (id unik) → poster detail. Tambah `metadataBase` + `data-scroll-behavior="smooth"`.
- 2026-10-11 — **Perbaikan (arahan pengguna)**: (a) poster `/anime/[id]` sempat **tertimpa banner** — section konten diberi `relative z-10` agar naik di atas banner. (b) Banner yang sempat kuhilangkan **dipulihkan**: `backdrop = bannerImage ?? coverImage` (fallback cover untuk anime tanpa `bannerImage`).
- 2026-10-11 — **F-02 & F-10 diperluas (arahan pengguna — ingin jalan cerita, fakta, deskripsi karakter)**: memakai **AniList saja** (tanpa API baru; Jikan tak dipakai). **F-02**: tambah panel **Fakta** (sumber, negara, tanggal mulai/selesai, popularitas, favorit), **Tag** ter-rank (spoiler disembunyikan default), **Peringkat** all-time, **Serial Terkait** (`relations` relationType v2), **daftar Episode** (`streamingEpisodes`), dan lencana "Episode X segera tayang" (`nextAiringEpisode`). **F-10**: kartu karakter kini menampilkan **bio lengkap** (`Character.description`, dibersihkan dari Markdown + marker spoiler `~!...!~`) + **gender/umur/gol. darah**. Provider: `MEDIA_FIELDS` diperluas (`source`, `countryOfOrigin`, `popularity`, `favourites`, `hashtag`, `synonyms`, `startDate`/`endDate`); `DETAIL_QUERY` tambah `tags`/`relations`/`rankings`/`streamingEpisodes`/`nextAiringEpisode`; `CHARACTERS_QUERY` tambah `description`/`gender`/`age`/`bloodType`/`favourites`; tipe `Tag`/`RelationEdge`/`Ranking`/`StreamingEpisode` ditambah. Komponen `SpoilerText` (client) untuk konten ber-spoiler (default tertutup).
- 2026-10-11 — **Perbaikan hero (arahan pengguna)**: judul hero yang sangat panjang meluber ke atas keluar section hingga tertutup navbar. Diperbaiki: judul `line-clamp-2` + ukuran adaptif `text-[clamp(2.25rem,6vw,5.5rem)]`, sinopsis `line-clamp-2 sm:line-clamp-3`, kontainer konten `overflow-hidden pt-20` (cadangan zona navbar). Diverifikasi via geometri CDP di 360/390/1280px — judul selalu di dalam section.
- 2026-10-11 — **Rebrand Nexusnime → Jelajanime (arahan pengguna, sebelum publish)**: nama di `config/site.ts`, navbar, footer, OG image, `package.json`/`package-lock.json`, README, dan dokumen ini. Tagline baru: **"Jelajahi anime, temukan ceritanya."** Wordmark navbar/footer kini **teks** (`JELAJA`+`NIME`, aksen kuning) — tidak lagi memakai `public/logo.png` (aset lama dibiarkan). Favicon `app/icon.png` dibuat ulang (huruf **"J"** kuning `#FFF200` di latar `#0A0A0B`). Kunci `localStorage` watchlist → `jelajanime:watchlist`. Domain/`NEXT_PUBLIC_SITE_URL` tidak berubah.
- 2026-10-11 — **Palet baru: "Morning Sunshine & Serenity" — tema gelap → terang (arahan pengguna)**: token `app/globals.css` diganti ke Cream White `#FCF5C7` (latar), surface `#FFFFFF`/`#FFF7DA`, border `#E7DEB4`, teks `#2B2B26`, muted `#7B7460`, aksen **Warm Sunshine** `#FFC069` + **Soft Sky Blue** `#79ADDC` + **Lively Mint** `#ADF7B6`. Token baru `--color-scrim` `#1A1712` (tetap gelap) menggantikan peran ganda `ink` sebagai scrim di atas gambar (hero, banner detail, kartu poster, watchlist) + teks di atas gambar jadi putih eksplisit. Navbar: transparan + teks putih saat di atas hero → frost putih + teks gelap saat scroll. `.film-grain` → `mix-blend-mode: multiply` opacity `.04`. Genre accent (F-13) diselaraskan ke nuansa terang/pastel. OG image & favicon (`app/icon.png`: "J" Warm Sunshine di latar Cream) dibuat ulang. `layout.tsx` tambah `themeColor` + `colorScheme: light`. Verifikasi kontras via render headless (teks hero/banner tetap terbaca).
- 2026-10-11 — **Perbaikan kontras tipografi (arahan pengguna — "ada warna yang tidak bisa dibaca")**: Warm Sunshine `#FFC069` sebagai **teks** di latar cream hanya bernilai kontras ~1.46 (di bawah WCAG AA) → ditambah token **`--color-accent-text`** `#8A5518` (oranye tua, ratio ~5.6) khusus untuk teks; `--color-accent` tetap untuk background/border. Seluruh `text-accent`/`hover:text-accent` di permukaan terang dialihkan ke `text-accent-text` (kecuali yang memang di atas scrim gelap: skor/badge hero & kartu, wordmark navbar saat di atas hero). `--color-accent-deep` diganti ke **Sky Dark `#235C8F`** (agar aman sebagai teks). `--color-muted` digelapkan `#7B7460` → **`#6E6755`** (ratio 4.22 → 5.09). Badge skor kartu `bg-scrim/70` → **`bg-scrim/90`** (teks oranye tetap terbaca di atas poster apa pun). Diverifikasi dengan audit kontras otomatis (render headless + sampling piksel) di beranda/detail/karakter/browse/search/watchlist/404: 0 pelanggaran.
- 2026-10-11 — **Perbaikan kontras judul/subjudul/detail anime (arahan pengguna)**: pada `/anime/[id]`, blok judul (breadcrumb, judul, judul asli, fakta/rating) ternyata **duduk di atas latar cream** (bukan di atas banner — banner hanya 46vh dan poster yang di-`-mt`), sehingga teks putih tak terbaca. Perbaikan: struktur diubah agar **poster** saja yang menarik ke atas (`-mt-24 sm:-mt-28`), sedangkan **teks berada di bawah banner** dengan warna gelap (`text-foreground`/`text-muted`, pemisah `bg-line`). Banner diberi **fade ke warna halaman** (`h-32 bg-gradient-to-t from-ink`) agar menyatu, scrim disesuaikan (`from-scrim via-scrim/60 to-scrim/25`). **Chip genre** (detail + browse) kini memakai warna teks yang digelapkan via `genreAccentText()` (`color-mix(in oklab, <accent> 55%, #2B2B26)`) agar tetap berwarna namun kontras. Diverifikasi: judul ratio **12.9**, breadcrumb **5.1**; audit otomatis 0 pelanggaran (desktop 900/1400px & mobile 390px).
- 2026-10-11 — **Perbaikan error halaman detail (arahan pengguna — "selalu error: Ups! Terjadi kesalahan")**: thumbnail episode (`streamingEpisodes`) berasal dari CDN pihak ketiga `img1.ak.crunchyroll.com` yang tak terdaftar di `next.config.ts` `images.remotePatterns` → `next/image` melempar "Invalid src prop ... hostname not configured". Perbaikan: gambar thumbnail episode memakai **`unoptimized`** (loader dilewati → tak ada validasi host & tak mem-proxy CDN pihak ketiga; `s4.anilist.co` tetap satu-satunya host terdaftar untuk poster/karakter). Diverifikasi: `/anime/113415`, `/anime/202250`, `/anime/20`, `/anime/16498` → HTTP 200 tanpa error, thumbnail memakai URL langsung Crunchyroll; beranda/browse/watchlist/search/karakter juga bersih.
- 2026-10-11 — **Publish ke Vercel (arahan pengguna)**: aplikasi di-deploy produksi via Vercel CLI. Project `abex2/jelajanime`, **Production: https://jelajanime.vercel.app**. Sebelum deploy: `config/site.ts` diberi fallback URL otomatis (`NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → localhost) agar metadata/OG benar di produksi; `themeColor`/`colorScheme` dipindah dari `metadata` ke **`viewport` export** (`app/layout.tsx`) menghilangkan warning build Next 16. Verifikasi produksi: beranda/browse/detail (113415, 202250)/search/watchlist/karakter/OG → HTTP 200 tanpa error; `<title>`, `theme-color` `#FCF5C7`, `color-scheme light` benar. Proteksi deployment hanya untuk preview (produksi publik).

## 16. Open Questions
- Detail Auth.js (provider config, sesi) — dibahas sebelum v1.
- Sumber player legal untuk F-15 (karya domain-publik/CC) — dibahas sebelum v2.
- `/anime/[id]` dengan id tak valid menampilkan UI 404 tapi berstatus HTTP 200 (batasan PPR/`cacheComponents` — shell ter-stream sebelum `notFound()`). Route di luar daftar tetap 404. Perlu ditinjau bila SEO 404 wajib untuk id tak valid.
