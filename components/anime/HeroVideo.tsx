"use client";

import { useEffect, useState } from "react";

// Background video Hero: iframe YouTube (muted, autoplay, loop) yang di-cover
// penuh. Dimatikan bila pengguna memilih reduce-motion → fallback gambar.
export function HeroVideo({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  const src =
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${youtubeId}` +
    `&controls=0&modestbranding=1&playsinline=1&rel=0` +
    `&disablekb=1&iv_load_policy=3&fs=0`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <iframe
        src={src}
        title={`${title} — pratinjau`}
        allow="autoplay; encrypted-media; picture-in-picture"
        tabIndex={-1}
        className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
