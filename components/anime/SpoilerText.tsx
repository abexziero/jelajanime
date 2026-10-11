"use client";

import { useState } from "react";

// Konten berpotensi spoiler — tersembunyi default, dibuka via tombol (a11y).
export function SpoilerText({
  children,
  className = "",
  label = "Lihat spoiler",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const [shown, setShown] = useState(false);

  if (shown) {
    return <span className={className}>{children}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => setShown(true)}
      aria-expanded={false}
      className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted ring-1 ring-line transition hover:text-foreground"
    >
      {label}
    </button>
  );
}
