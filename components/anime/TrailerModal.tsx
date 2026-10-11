"use client";

import { useRef, useState } from "react";
import { IconClose, IconMuted, IconSound } from "@/components/icons";

type Props = {
  youtubeId: string;
  label?: string;
  className?: string;
};

// Modal trailer pakai <dialog> native — escape + backdrop gratis, tanpa dependency.
// Suara dikontrol tombol sendiri lewat YouTube IFrame API (postMessage), jadi
// trailer tetap mulai dalam keadaan mute namun bisa di-unmute tanpa kontrol YouTube.
export function TrailerModal({ youtubeId, label = "▶ Tonton Trailer", className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);

  const command = (func: string) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*",
    );
  };

  const open = () => {
    setMuted(true);
    ref.current?.showModal();
  };

  const close = () => ref.current?.close();

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    const func = next ? "mute" : "unMute";
    command(func);
    if (!next) {
      // Ulangi setelah player siap (command awal bisa terbuang sebelum ready).
      window.setTimeout(() => command(func), 250);
      window.setTimeout(() => command("playVideo"), 400);
    }
  };

  return (
    <>
      <button onClick={open} className={className}>
        {label}
      </button>
      <dialog
        ref={ref}
        onClick={(event) => {
          if (event.target === ref.current) close();
        }}
        className="m-auto w-[min(90vw,60rem)] rounded-2xl border border-line bg-surface p-0 text-foreground backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm text-muted">Trailer Resmi</span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
              aria-pressed={!muted}
              className="flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition hover:border-accent/50 hover:text-foreground"
            >
              {muted ? <IconMuted width={14} height={14} /> : <IconSound width={14} height={14} />}
              {muted ? "Suara" : "Bisukan"}
            </button>
            <button
              onClick={close}
              aria-label="Tutup"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent/50 hover:text-foreground"
            >
              <IconClose />
            </button>
          </div>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&enablejsapi=1&playsinline=1&controls=1`}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </dialog>
    </>
  );
}
