"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Suggestion = {
  id: number;
  title: string;
  coverImage: string;
  year: number | null;
  format: string | null;
  score: number | null;
};

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = query.trim();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (term.length < 2) {
        setItems([]);
        setOpen(false);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { items: Suggestion[] };
        setItems(data.items);
        setOpen(true);
      } catch {
        /* dibatalkan / gagal — abaikan */
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (term) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} role="search">
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2.5 focus-within:border-accent/60">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="shrink-0 text-muted"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setOpen(items.length > 0)}
            placeholder="Cari anime…"
            aria-label="Cari anime"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
      </form>

      {open && items.length > 0 ? (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-2xl shadow-black/10 backdrop-blur-md">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(`/anime/${item.id}`);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-surface"
            >
              <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-surface-2 ring-1 ring-line">
                {item.coverImage ? (
                  <Image
                    src={item.coverImage}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm">{item.title}</span>
                <span className="block text-xs text-muted">
                  {[item.format, item.year].filter(Boolean).join(" · ")}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
