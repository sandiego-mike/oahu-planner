import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("placeId");
  const key = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId) return NextResponse.json({ error: "Missing placeId" }, { status: 400 });
  if (!key) return NextResponse.json({ error: "Google Places API key not configured." }, { status: 500 });

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,rating,user_ratings_total,formatted_address,photos,website,url,types");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  const data = await res.json();
  return NextResponse.json(data);
}
