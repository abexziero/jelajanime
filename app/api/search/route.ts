import { NextResponse } from "next/server";
import { catalog } from "@/lib/providers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await catalog.search(q, 1, 8);
    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        coverImage: item.coverImage,
        year: item.year,
        format: item.format,
        score: item.score,
      })),
    });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
