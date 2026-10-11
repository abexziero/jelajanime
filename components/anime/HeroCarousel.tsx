"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogItem } from "@/lib/providers";
import { TrailerModal } from "./TrailerModal";
import { WatchlistButton } from "./WatchlistButton";
import { HeroVideo } from "./HeroVideo";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

const ROTATE_MS = 8000;

export function HeroCarousel({ items }: { items: CatalogItem[] }) {
  const slides = items.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timer = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Entrance timeline untuk slide aktif: SplitText judul + stagger meta/tombol.
  useEffect(() => {
    const stage = stageRef.current?.querySelector<HTMLElement>(
      `[data-slide-content="${index}"]`,
    );
    const title = stage?.querySelector<HTMLElement>("h1");
    if (!stage || !title) return;

    if (prefersReducedMotion()) return;

    const split = new SplitText(title, { type: "chars,words" });
    const items = stage.querySelectorAll<HTMLElement>("[data-hero-item]");
    const tl = gsap.timeline();

    // Hanya animasikan transform + fade judul. Item meta/sinopsis/tombol
    // TIDAK di-fade (hanya slide-up) agar teks tak pernah tertinggal opacity 0.
    tl.fromTo(
      split.chars,
      { opacity: 0, yPercent: 60 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.02,
        clearProps: "opacity,transform",
      },
    ).fromTo(
      items,
      { y: 18 },
      {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "transform",
      },
      "-=0.35",
    );

    return () => {
      tl.kill();
      gsap.set(split.chars, { clearProps: "opacity,transform" });
      gsap.set(items, { clearProps: "transform" });
      split.revert();
    };
  }, [index]);

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (reduceMotion || paused || slides.length < 2) return;
    timer.current = window.setInterval(
      () => setIndex((value) => (value + 1) % slides.length),
      ROTATE_MS,
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [reduceMotion, paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      ref={stageRef}
      className="relative h-[72vh] min-h-[540px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Anime unggulan"
    >
      {slides.map((anime, i) => {
        const active = i === index;
        const backdrop = anime.bannerImage ?? anime.coverImage;
        return (
          <div
            key={anime.id}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!active}
          >
            {backdrop ? (
              <Image
                src={backdrop}
                alt={anime.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            ) : null}
            {active && anime.trailerYoutubeId ? (
              <HeroVideo youtubeId={anime.trailerYoutubeId} title={anime.title} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/55 to-scrim/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-scrim/90 via-scrim/40 to-transparent" />
            <span className="film-grain" aria-hidden />

            <div
              data-slide-content={i}
              className="relative mx-auto flex h-full max-w-7xl flex-col justify-end overflow-hidden px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-24 lg:px-10"
            >
              <span
                data-hero-item
                className="mb-3 w-fit rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent"
              >
                Trending
              </span>
              <h1 className="line-clamp-2 font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-wide">
                {anime.title}
              </h1>
              <div
                data-hero-item
                className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80"
              >
                {anime.score ? (
                  <span className="font-semibold text-accent">
                    ★ {anime.score.toFixed(1)}
                  </span>
                ) : null}
                {anime.year ? <span>{anime.year}</span> : null}
                {anime.format ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    <span>{anime.format}</span>
                  </>
                ) : null}
                {anime.genres.length ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    <span>{anime.genres.slice(0, 3).join(" · ")}</span>
                  </>
                ) : null}
              </div>
              {anime.synopsis ? (
                <p
                  data-hero-item
                  className="mt-4 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/70 sm:line-clamp-3 sm:text-base"
                >
                  {anime.synopsis.length > 220
                    ? `${anime.synopsis.slice(0, 220).trimEnd()}…`
                    : anime.synopsis}
                </p>
              ) : null}
              <div data-hero-item className="mt-7 flex flex-wrap gap-3">
                {anime.trailerYoutubeId ? (
                  <TrailerModal
                    youtubeId={anime.trailerYoutubeId}
                    className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-foreground shadow-[0_10px_30px_-12px] shadow-scrim/50 transition hover:brightness-110"
                  />
                ) : null}
                <WatchlistButton entry={anime} />
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Sebelumnya"
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-scrim/50 text-white backdrop-blur transition hover:border-accent/60 hover:text-accent sm:flex"
          >
            <IconChevronLeft width={20} height={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Selanjutnya"
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-scrim/50 text-white backdrop-blur transition hover:border-accent/60 hover:text-accent sm:flex"
          >
            <IconChevronRight width={20} height={20} />
          </button>
        </>
      ) : null}

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2">
          {slides.map((anime, i) => (
            <button
              key={anime.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Tampilkan ${anime.title}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${
                i === index
                  ? "w-8 bg-accent"
                  : "w-3 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
