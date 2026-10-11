"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconChevronDown } from "@/components/icons";

export type FilterOption = { value: string; label: string; href: string };

export type FilterGroup = {
  key: string;
  label: string;
  value: string;
  options: FilterOption[];
};

export function FilterBar({
  groups,
  resetHref,
  activeCount,
}: {
  groups: FilterGroup[];
  resetHref: string;
  activeCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const selects = (group: FilterGroup) => {
    const active = group.value !== group.options[0]?.value;
    return (
      <div key={group.key} className="relative">
        <label className="sr-only" htmlFor={`filter-${group.key}`}>
          {group.label}
        </label>
        <select
          id={`filter-${group.key}`}
          value={group.value}
          onChange={(event) => {
            const next = group.options.find(
              (option) => option.value === event.target.value,
            );
            if (next) router.push(next.href);
          }}
          className={`w-full cursor-pointer appearance-none rounded-full border py-1.5 pl-3 pr-8 text-xs outline-none transition sm:w-auto ${
            active
              ? "border-accent/60 bg-accent/10 text-accent-text"
              : "border-line bg-surface/60 text-muted hover:border-accent/50"
          }`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.6rem center",
          }}
        >
          {group.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const reset =
    activeCount > 0 ? (
      <Link
        href={resetHref}
        className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-accent/50 hover:text-accent-text"
      >
        Reset filter ({activeCount})
      </Link>
    ) : null;

  return (
    <div className="border-y border-line py-4">
      {/* Mobile: tombol toggle filter */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-full border border-line bg-surface/60 px-4 py-2 text-sm text-muted transition hover:border-accent/50 sm:hidden"
      >
        <span>Filter{activeCount > 0 ? ` (${activeCount})` : ""}</span>
        <IconChevronDown
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Desktop: selalu tampil. Mobile: mengikuti toggle. */}
      <div
        className={`${open ? "flex" : "hidden"} mt-3 flex-col gap-2 sm:mt-0 sm:flex sm:flex-row sm:flex-wrap sm:items-center`}
      >
        {groups.map(selects)}
        {reset}
      </div>
    </div>
  );
}
