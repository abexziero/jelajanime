# Jelajanime

Katalog anime modern berbahasa Indonesia — dark cinematic, dibangun dengan Next.js 16 (App Router), React 19, Tailwind CSS v4. Data dari AniList (tanpa API key). Sumber kebenaran fitur: [`PRD.md`](./PRD.md).

## Perintah

```bash
npm install      # project .npmrc sudah mengatasi allow-scripts
npm run dev      # http://localhost:3000
npm run lint     # eslint
npm run typecheck
npm run build
```

## Struktur singkat

- `app/` — route (home, `/browse`, dst)
- `components/` — `layout/`, `anime/`
- `lib/providers/` — interface `CatalogProvider` + adapter AniList
- `public/logo.png` — aset logo lama (tidak dipakai; wordmark navbar/footer kini teks)
- `config/site.ts` — nama, tagline, deskripsi
