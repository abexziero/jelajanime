"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-6xl tracking-wide text-accent-text sm:text-8xl">
        Ups!
      </p>
      <h1 className="mt-4 font-display text-3xl tracking-wide sm:text-4xl">
        Terjadi kesalahan
      </h1>
      <p className="mt-3 text-sm text-muted">
        {error.message || "Sesuatu gagal dimuat. Coba lagi sebentar."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-foreground transition hover:brightness-110"
      >
        Coba Lagi
      </button>
    </div>
  );
}
