"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconSearch } from "@/components/icons";

type Suggestion = {
  id: number;
  title: string;
  coverImage: string;
  year: number | null;
  format: string | null;
};

// Command-bar inline di navbar: debounce + /api/search + dropdown saran.
export function NavSearch({
  className = "",
  scrolled = true,
}: {
  className?: string;
  scrolled?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      setQuery("");
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search">
        <div
          className={`flex items-center gap-2 rounded-full border px-3.5 py-2 transition focus-within:border-accent/60 ${
            scrolled
              ? "border-line/70 bg-surface/70 text-foreground"
              : "border-white/30 bg-scrim/35 text-white"
          }`}
        >
          <IconSearch
            width={15}
            height={15}
            className={`shrink-0 ${scrolled ? "text-muted" : "text-white/70"}`}
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setOpen(items.length > 0)}
            placeholder="Cari anime…"
            aria-label="Cari anime"
            className={`w-full bg-transparent text-sm outline-none placeholder:text-current placeholder:opacity-60 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          />
          <kbd
            className={`hidden shrink-0 rounded border px-1.5 text-[10px] lg:inline ${
              scrolled ? "border-line text-muted" : "border-white/30 text-white/70"
            }`}
          >
            /
          </kbd>
        </div>
      </form>

      {open && items.length > 0 ? (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface/95 text-foreground shadow-2xl shadow-black/10">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setOpen(false);
                setQuery("");
                router.push(`/anime/${item.id}`);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-accent/10"
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
