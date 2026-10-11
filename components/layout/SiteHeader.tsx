import { catalog } from "@/lib/providers";
import { NavShell } from "./NavShell";

export async function SiteHeader() {
  let genres: string[] = [];
  try {
    genres = await catalog.getGenres();
  } catch {
    genres = [];
  }

  return <NavShell genres={genres} />;
}
