import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@/lib/providers";

export const instant = false;

const ROLE: Record<string, string> = {
  MAIN: "Utama",
  SUPPORTING: "Pendukung",
  BACKGROUND: "Latar",
};

const load = async (id: string) => {
  const numeric = Number(id);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  try {
    return await catalog.getCharacters(numeric);
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: PageProps<"/anime/[id]/characters">): Promise<Metadata> {
  const { id } = await params;
  const data = await load(id);
  return { title: data ? `Karakter & Staf — ${data.animeTitle}` : "Karakter" };
}

export default async function CharactersPage({
  params,
}: PageProps<"/anime/[id]/characters">) {
  const { id } = await params;
  const data = await load(id);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <Link
        href={`/anime/${id}`}
        className="text-sm text-muted transition hover:text-accent-text"
      >
        ← Kembali ke detail
      </Link>

      <h1 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
        Karakter &amp; Staf
      </h1>
      <p className="mt-1 text-sm text-muted">{data.animeTitle}</p>

      {data.characters.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-wide text-accent-text">
            Karakter
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.characters.map((character) => (
              <article
                key={character.id}
                className="flex gap-4 rounded-2xl border border-line bg-surface/40 p-4"
              >
                {character.image ? (
                  <Image
                    src={character.image}
                    alt={character.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-line"
                  />
                ) : (
                  <span className="h-20 w-20 shrink-0 rounded-xl bg-surface-2 ring-1 ring-line" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{character.name}</p>
                  <p className="text-xs text-muted">
                    {character.role
                      ? (ROLE[character.role] ?? character.role)
                      : "—"}
                  </p>
                  {[
                    character.gender,
                    character.age ? `Umur ${character.age}` : null,
                    character.bloodType ? `Darah ${character.bloodType}` : null,
                  ].some(Boolean) ? (
                    <p className="mt-1 text-xs text-muted">
                      {[
                        character.gender,
                        character.age ? `Umur ${character.age}` : null,
                        character.bloodType
                          ? `Gol. darah ${character.bloodType}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  ) : null}
                  {character.description ? (
                    <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-foreground/70">
                      {character.description}
                    </p>
                  ) : null}
                  {character.voiceActors.length > 0 ? (
                    <div className="mt-2 flex items-center gap-2">
                      {character.voiceActors[0].image ? (
                        <Image
                          src={character.voiceActors[0].image}
                          alt={character.voiceActors[0].name}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-line"
                        />
                      ) : null}
                      <span className="truncate text-xs text-muted">
                        {character.voiceActors[0].name}
                      </span>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {data.staff.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl tracking-wide text-accent-deep">
            Staf
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.staff.map((member) => (
              <article
                key={member.id}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface/40 p-4"
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-line"
                  />
                ) : (
                  <span className="h-14 w-14 shrink-0 rounded-full bg-surface-2 ring-1 ring-line" />
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.name}</p>
                  <p className="truncate text-xs text-muted">
                    {member.role ?? "—"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
