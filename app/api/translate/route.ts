import { NextResponse } from "next/server";

type DictionaryEntry = [string, string, string[]?];
export async function POST(request: Request) {
  try {
    const body = await request.json() as { word?: unknown };
    const word = typeof body.word === "string" ? body.word.trim() : "";
    if (!word) return NextResponse.json({ error: "Word is required" }, { status: 400 });
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&dt=bd&q=${encodeURIComponent(word)}`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" });
    if (!response.ok) throw new Error("Translation service unavailable");
    const data: unknown[] = await response.json();
    const primaryTranslation = Array.isArray(data[0]) && Array.isArray(data[0][0]) ? String(data[0][0][0] ?? "") : "";
    const partsOfSpeech: string[] = [], alternativeMeanings: string[] = [];
    if (Array.isArray(data[1])) for (const raw of data[1] as unknown[]) {
      if (!Array.isArray(raw)) continue;
      const entry = raw as DictionaryEntry;
      if (typeof entry[0] === "string") partsOfSpeech.push(entry[0]);
      if (Array.isArray(entry[2])) alternativeMeanings.push(...entry[2].filter((item): item is string => typeof item === "string"));
    }
    return NextResponse.json({ turkishWord: word, primaryTranslation, partsOfSpeech: [...new Set(partsOfSpeech)], alternativeMeanings: [...new Set(alternativeMeanings)] });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Lookup failed" }, { status: 502 }); }
}
