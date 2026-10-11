"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { genreLabel } from "@/lib/genres";
import { MegaMenu } from "./MegaMenu";
import { NavSearch } from "@/components/search/NavSearch";
import { IconClose, IconMenu, IconSearch } from "@/components/icons";

const nav = [
  { href: "/", label: "Beranda" },
  { href: "/browse", label: "Jelajahi" },
  { href: "/watchlist", label: "Watchlist" },
];

const box =
  "flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface/60";

export function NavShell({ genres }: { genres: string[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-7xl">
        {/* Lapisan frost terpisah (sibling) — bukan leluhur panel mega-menu. */}
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 rounded-full border transition-all duration-300 motion-reduce:transition-none ${
            scrolled
              ? "border-line/60 bg-surface/85 opacity-100 shadow-lg shadow-black/10 backdrop-blur-xl"
              : "border-transparent bg-scrim/35 opacity-100 backdrop-blur-sm"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-6 -bottom-px h-px rounded-full bg-gradient-to-r from-accent/60 via-accent/10 to-accent-deep/60 transition-opacity duration-300 motion-reduce:transition-none ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`flex h-14 items-center gap-3 px-3 transition-colors duration-300 motion-reduce:transition-none sm:px-5 ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center font-display text-xl tracking-wider transition hover:opacity-80 sm:text-2xl"
          >
            <span>
              JELAJA
              <span className={scrolled ? "text-accent-text" : "text-accent"}>
                NIME
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="ml-2 hidden items-center gap-1 md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-sm transition ${
                  isActive(item.href)
                    ? scrolled
                      ? "text-foreground"
                      : "text-white"
                    : `hover:brightness-110 ${scrolled ? "text-muted hover:text-foreground" : "text-white/80 hover:text-white"}`
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-200 motion-reduce:transition-none ${
                    isActive(item.href) ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            ))}
            <MegaMenu genres={genres} scrolled={scrolled} />
          </nav>

          <NavSearch
            scrolled={scrolled}
            className="ml-auto hidden w-[22rem] max-w-[40vw] md:block"
          />

          <div className="ml-auto flex items-center gap-1 md:hidden">
            <Link href="/search" aria-label="Cari anime" className={box}>
              <IconSearch />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label="Menu navigasi"
              className={box}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="mt-3 rounded-2xl border border-line bg-surface/95 p-4 text-foreground shadow-2xl shadow-black/10 md:hidden">
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    isActive(item.href)
                      ? "bg-accent/15 text-accent-text"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted">
              Kategori
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-3">
              {genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/browse?genre=${encodeURIComponent(genre)}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-accent/10 hover:text-accent-text"
                >
                  {genreLabel(genre)}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
