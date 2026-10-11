"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "jelajanime:watchlist";

export type WatchlistEntry = {
  id: number;
  title: string;
  coverImage: string;
  year?: number | null;
  format?: string | null;
  score?: number | null;
  addedAt: number;
};

const listeners = new Set<() => void>();

const parse = (raw: string | null): WatchlistEntry[] => {
  try {
    const value = raw ? (JSON.parse(raw) as WatchlistEntry[]) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const readRaw = (): string => {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const getServerSnapshot = (): string => "[]";

const write = (next: WatchlistEntry[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage penuh / diblokir — abaikan */
  }
  emit();
};

export function useWatchlist() {
  const raw = useSyncExternalStore(subscribe, readRaw, getServerSnapshot);
  const entries = useMemo(() => parse(raw), [raw]);

  const has = useCallback(
    (id: number) => entries.some((entry) => entry.id === id),
    [entries],
  );

  const toggle = useCallback((entry: Omit<WatchlistEntry, "addedAt">) => {
    const current = parse(readRaw());
    write(
      current.some((item) => item.id === entry.id)
        ? current.filter((item) => item.id !== entry.id)
        : [{ ...entry, addedAt: Date.now() }, ...current],
    );
  }, []);

  const remove = useCallback((id: number) => {
    write(parse(readRaw()).filter((item) => item.id !== id));
  }, []);

  return { entries, has, toggle, remove };
}
