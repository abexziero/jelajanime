import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-7xl tracking-wide text-accent-text sm:text-9xl">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl tracking-wide sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 text-sm text-muted">
        Anime atau halaman yang kamu cari tidak tersedia.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-foreground transition hover:brightness-110"
        >
          Ke Beranda
        </Link>
        <Link
          href="/browse"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent/50 hover:text-accent-text"
        >
          Jelajahi Anime
        </Link>
      </div>
    </div>
  );
}
