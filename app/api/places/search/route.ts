import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  const hint = request.nextUrl.searchParams.get("hint") ?? "";
  const key = process.env.GOOGLE_PLACES_API_KEY;

  if (!q?.trim()) return NextResponse.json({ results: [] });
  if (!key) return NextResponse.json({ error: "Google Places API key not configured." }, { status: 500 });

  const search = `${q} ${hint} Oahu Hawaii`.trim();
  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", search);
  url.searchParams.set("location", "21.4389,-158.0001");
  url.searchParams.set("radius", "40000");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  const data = await res.json();
  return NextResponse.json(data);
}
