import { NextResponse } from "next/server";
type Item = { title?: string; imageinfo?: { thumburl?: string; url?: string }[] };
export async function POST(request: Request) {
  try {
    const { word } = await request.json() as { word?: unknown };
    if (typeof word !== "string" || !word.trim()) return NextResponse.json({ error: "Word is required" }, { status: 400 });
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(word)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&origin=*`;
    const response = await fetch(url, { headers: { "User-Agent": "TurkishVocabularyLogger/1.0" }, cache: "no-store" });
    if (!response.ok) throw new Error("Image service unavailable");
    const data = await response.json() as { query?: { pages?: Record<string, Item> } };
    const images = Object.values(data.query?.pages ?? []).flatMap((item) => { const info = item.imageinfo?.[0]; return info?.thumburl || info?.url ? [{ title: item.title?.replace(/^File:/, "") ?? "", url: info.thumburl ?? info.url ?? "" }] : []; });
    return NextResponse.json({ images });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Image search failed" }, { status: 502 }); }
}
