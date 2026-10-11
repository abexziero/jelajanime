<img width="100%" src="assets/hero.svg" alt="Jelajanime" />

<p align="center">
  <strong>Jelajahi anime, temukan ceritanya.</strong><br/>
  Katalog anime modern berbahasa Indonesia — cepat, sinematik, sepenuhnya responsif.<br/>
  Data dari AniList. Hanya menautkan sumber streaming legal.
</p>

<p align="center">
  <a href="https://jelajanime.vercel.app"><img src="https://img.shields.io/badge/Kunjungi%20Situs-FFC069?style=for-the-badge&logo=vercel&logoColor=black" alt="Live" /></a>
  <a href="https://github.com/abexziero/jelajanime"><img src="https://img.shields.io/badge/Star%20Repo-235C8F?style=for-the-badge&logo=github&logoColor=white" alt="Star" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/GSAP_3-88CE02?style=for-the-badge&logo=greensock&logoColor=black" alt="GSAP" />
  <img src="https://img.shields.io/badge/Data-AniList-02A9FF?style=for-the-badge&logo=anilist&logoColor=white" alt="AniList" />
</p>

<p align="center"><img width="100%" src="docs/preview.png" alt="Tampilan Jelajanime" /></p>
<p align="center"><sub>Beranda — hero carousel dengan latar video trailer.</sub></p>

<img width="100%" src="assets/band-fitur.svg" alt="Fitur" />

<table>
  <tr>
    <td><strong>Beranda sinematik</strong><br/>Hero carousel 5 anime trending, latar video trailer, auto-rotate, jeda saat hover.</td>
    <td><strong>Detail lengkap</strong><br/>Meta, genre, sinopsis, karakter, daftar episode, rekomendasi.</td>
  </tr>
  <tr>
    <td><strong>Pencarian instan</strong><br/>Command-bar di navbar (<code>/</code>), debounce 300 ms, saran poster.</td>
    <td><strong>Jelajahi / Browse</strong><br/>Filter genre, format, status, tahun + pagination.</td>
  </tr>
  <tr>
    <td><strong>Watchlist</strong><br/>Tersimpan di <code>localStorage</code>, sinkron antar-tab.</td>
    <td><strong>Trailer modal</strong><br/>Pemutar <code>youtube-nocookie</code> di dialog native.</td>
  </tr>
</table>

<img width="100%" src="assets/band-galeri.svg" alt="Galeri" />

<p align="center"><img width="100%" src="docs/preview.png" alt="Beranda Jelajanime" /></p>
<p align="center"><sub>Beranda — hero carousel dengan latar video trailer.</sub></p>

<img width="100%" src="assets/band-stack.svg" alt="Tech Stack" />

<table>
  <tr><th>Lapisan</th><th>Teknologi</th></tr>
  <tr><td>Framework</td><td><strong>Next.js 16</strong> (App Router, Turbopack, PPR)</td></tr>
  <tr><td>UI</td><td><strong>React 19</strong> + <strong>TypeScript</strong></td></tr>
  <tr><td>Styling</td><td><strong>Tailwind CSS v4</strong> (token <code>@theme</code>)</td></tr>
  <tr><td>Animasi</td><td><strong>GSAP 3</strong> + <code>@gsap/react</code></td></tr>
  <tr><td>Data</td><td><strong>AniList GraphQL API</strong> (tanpa API key)</td></tr>
  <tr><td>Deploy</td><td><strong>Vercel</strong> (auto-deploy dari GitHub)</td></tr>
</table>

<img width="100%" src="assets/band-arsitektur.svg" alt="Arsitektur" />

```text
UI (App Router) → CatalogProvider → adapter anilist → AniList GraphQL API
```

Provider-agnostik: UI terpisah dari sumber data. Ganti sumber = buat adapter baru.

<img width="100%" src="assets/band-mulai.svg" alt="Menjalankan Lokal" />

```bash
npm install      # .npmrc sudah mengatasi allow-scripts
npm run dev      # http://localhost:3000
npm run lint     # eslint
npm run typecheck
npm run build
```

---

Data anime dari [AniList](https://anilist.co). Jelajanime tidak berafiliasi dengan AniList dan **tidak** meng-host video berhak cipta — tautan tonton mengarah ke layanan resmi berlisensi.
