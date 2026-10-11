"use client";

import { useState } from "react";
import { IconCheck, IconShare } from "@/components/icons";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* dibatalkan pengguna — abaikan */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Bagikan anime ini"
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-accent-text"
    >
      {copied ? <IconCheck width={15} height={15} /> : <IconShare width={15} height={15} />}
      {copied ? "Tersalin" : "Bagikan"}
    </button>
  );
}
