import { NextRequest, NextResponse } from "next/server";

// Oahu bounding box for Nominatim (west, north, east, south)
const OAHU_VIEWBOX = "-158.30,21.72,-157.65,21.25";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("viewbox", OAHU_VIEWBOX);
  url.searchParams.set("bounded", "1");
  url.searchParams.set("limit", "12");
  url.searchParams.set("accept-language", "en");
  url.searchParams.set("countrycodes", "us");

  try {
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "OahuFamilyPlanner/1.0 (family trip planner)" },
      next: { revalidate: 60 }
    });

    if (!res.ok) return NextResponse.json({ results: [], error: `Nominatim error ${res.status}` });

    const data: any[] = await res.json();

    const results = data
      .filter((el) => el.lat && el.lon)
      .map((el) => {
        const lat = parseFloat(el.lat);
        const lon = parseFloat(el.lon);
        const addr = el.address ?? {};

        // Best display name: prefer specific place name over generic display_name
        const name =
          addr.amenity ??
          addr.shop ??
          addr.tourism ??
          addr.leisure ??
          el.display_name.split(",")[0].trim();

        // Build a short address
        const street =
          addr.house_number && addr.road
            ? `${addr.house_number} ${addr.road}`
            : addr.road ?? addr.suburb ?? null;
        const city = addr.city ?? addr.town ?? addr.village ?? null;
        const addressParts = [street, city].filter(Boolean);

        return {
          id: el.place_id,
          osmType: el.osm_type,
          name,
          address: addressParts.length ? addressParts.join(", ") : null,
          placeType: el.type ?? el.category ?? "place",
          cuisine: null,
          website: null,
          phone: null,
          lat,
          lon,
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
        };
      });

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ results: [], error: "Search failed" });
  }
}
