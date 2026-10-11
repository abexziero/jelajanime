import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mt-8 flex flex-col items-center rounded-2xl border border-line bg-surface/40 px-6 py-14 text-center">
      {icon ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-muted">
          {icon}
        </span>
      ) : null}
      <p className="mt-4 font-display text-2xl tracking-wide">{title}</p>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-foreground transition hover:brightness-110"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
