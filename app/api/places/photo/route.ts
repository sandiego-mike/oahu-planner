import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  const key = process.env.GOOGLE_PLACES_API_KEY;

  if (!ref || !key) return new NextResponse("Not found", { status: 404 });

  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("maxwidth", "600");
  url.searchParams.set("photo_reference", ref);
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { redirect: "follow" });
  if (!res.ok) return new NextResponse("Photo not found", { status: 404 });

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
