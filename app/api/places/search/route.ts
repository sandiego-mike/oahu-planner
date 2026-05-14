import { NextRequest, NextResponse } from "next/server";

// Oahu bounding box (south, west, north, east) for Overpass
const OAHU = "21.25,-158.30,21.72,-157.65";

// Amenity/shop tags relevant to food and family trip
const FOOD_TAGS = [
  "restaurant", "cafe", "fast_food", "food_court",
  "ice_cream", "pub", "bar", "marketplace", "food"
].join("|");

const SHOP_TAGS = ["bakery", "confectionery", "ice_cream", "deli", "farm"].join("|");

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q?.trim()) return NextResponse.json({ results: [] });

  // Escape regex special chars so Overpass doesn't error on apostrophes etc.
  const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const overpassQuery = `
[out:json][timeout:15];
(
  node["name"~"${safe}",i]["amenity"~"${FOOD_TAGS}"](${OAHU});
  node["name"~"${safe}",i]["shop"~"${SHOP_TAGS}"](${OAHU});
  node["name"~"${safe}",i]["tourism"="attraction"](${OAHU});
  way["name"~"${safe}",i]["amenity"~"${FOOD_TAGS}"](${OAHU});
);
out body center 12;
  `.trim();

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(overpassQuery)}`
  });

  if (!res.ok) return NextResponse.json({ results: [] });

  const data = await res.json();
  const results = (data.elements ?? []).map((el: any) => {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    return {
      id: el.id,
      osmType: el.type,
      name: el.tags?.name ?? "Unknown",
      address: formatAddress(el.tags),
      placeType: el.tags?.amenity ?? el.tags?.shop ?? el.tags?.tourism ?? "place",
      cuisine: el.tags?.cuisine?.replace(/;/g, ", ") ?? null,
      website: el.tags?.website ?? el.tags?.["contact:website"] ?? null,
      phone: el.tags?.phone ?? el.tags?.["contact:phone"] ?? null,
      lat,
      lon,
      mapsUrl: lat && lon
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((el.tags?.name ?? q) + " Oahu Hawaii")}`
    };
  });

  return NextResponse.json({ results });
}

function formatAddress(tags: Record<string, string> = {}) {
  const parts = [
    tags["addr:housenumber"] && tags["addr:street"]
      ? `${tags["addr:housenumber"]} ${tags["addr:street"]}`
      : tags["addr:street"],
    tags["addr:city"] ?? tags["addr:town"] ?? tags["addr:village"],
    tags["addr:state"]
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}
