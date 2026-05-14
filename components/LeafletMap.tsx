"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  places,
  farmerMarkets,
  madeInHawaiiLocations,
  golfCourses
} from "@/lib/trip-data";
import type { RoutePlan } from "@/lib/types";

export function allMapPoints() {
  return [
    ...places.map((place) => ({ ...place, type: place.category, source: "place" as const })),
    ...farmerMarkets.map((market) => ({ ...market, type: "farmers-market" as const, source: "market" as const })),
    ...madeInHawaiiLocations.map((location) => ({
      ...location,
      type: "made-in-hawaii" as const,
      source: "made-in-hawaii" as const,
      address: location.address,
      driveFromResort: "Route-fit stop",
      tags: [location.category]
    })),
    ...golfCourses.map((course) => ({
      ...course,
      type: "golf" as const,
      source: "golf" as const,
      address: course.address,
      driveFromResort: course.driveFromKoOlina,
      tags: course.tags
    }))
  ];
}

export type MapPoint = ReturnType<typeof allMapPoints>[number];

function markerIconFor(point: MapPoint) {
  if (point.type === "beach") return "🏖";
  if (point.type === "trail") return "🥾";
  if (point.type === "food" || point.type === "shaved-ice") return "🍽";
  if (point.type === "brewery") return "🍺";
  if (point.type === "distillery") return "🥃";
  if (point.type === "golf") return "⛳";
  if (point.type === "farmers-market") return "🌽";
  if (point.type === "made-in-hawaii") return "✦";
  if (point.type === "resort") return "⌂";
  return "•";
}

const leafletTileSources = {
  roadmap: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors"
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Imagery"
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "© OpenTopoMap contributors"
  }
} as const;

export function LeafletMap({
  activeType,
  nearbyPoints,
  route,
  routePoints
}: {
  activeType: string;
  nearbyPoints: MapPoint[];
  route: RoutePlan;
  routePoints: Array<{ lat: number; lng: number; id: string; name: string; address?: string }>;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const linesRef = useRef<any[]>([]);
  const tileLayerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<keyof typeof leafletTileSources>("roadmap");

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    let cancelled = false;
    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css" as any)]).then(([{ default: L }]) => {
      if (cancelled || !mapRef.current || mapInstance.current) return;
      leafletRef.current = L;
      const map = L.map(mapRef.current, { center: [21.4389, -158.0001], zoom: 10 });
      const src = leafletTileSources.roadmap;
      tileLayerRef.current = L.tileLayer(src.url, { attribution: src.attribution, maxZoom: 19 }).addTo(map);
      mapInstance.current = map;
      setMapReady(true);
    });
    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
      leafletRef.current = null;
      tileLayerRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    if (!mapReady || !mapInstance.current || !L) return;
    if (tileLayerRef.current) mapInstance.current.removeLayer(tileLayerRef.current);
    const src = leafletTileSources[mapType];
    tileLayerRef.current = L.tileLayer(src.url, { attribution: src.attribution, maxZoom: 19 }).addTo(mapInstance.current);
  }, [mapReady, mapType]);

  useEffect(() => {
    const L = leafletRef.current;
    if (!mapReady || !mapInstance.current || !L) return;
    const map = mapInstance.current;

    markersRef.current.forEach((layer) => map.removeLayer(layer));
    linesRef.current.forEach((layer) => map.removeLayer(layer));
    markersRef.current = [];
    linesRef.current = [];

    const allLatLngs: any[] = [];

    if (routePoints.length > 1) {
      const latlngs = routePoints.map((p) => L.latLng(p.lat, p.lng));
      const line = L.polyline(latlngs, { color: route.color, opacity: 0.9, weight: 4 }).addTo(map);
      linesRef.current.push(line);
      allLatLngs.push(...latlngs);
    }

    routePoints.forEach((point: any, index: number) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${route.color};color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${index + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${point.name}</strong><br/>Stop ${index + 1} on ${route.label}`);
      markersRef.current.push(marker);
      allLatLngs.push(L.latLng(point.lat, point.lng));
    });

    nearbyPoints.forEach((point) => {
      const label = activeType === "all" ? "★" : markerIconFor(point);
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#f7b267;color:#18313b;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${label}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${point.name}</strong><br/>Nearby ${String(point.type).replace("-", " ")} stop`);
      markersRef.current.push(marker);
      allLatLngs.push(L.latLng(point.lat, point.lng));
    });

    if (allLatLngs.length > 0) {
      map.fitBounds(L.latLngBounds(allLatLngs), { padding: [40, 40] });
    }
  }, [activeType, mapReady, nearbyPoints, route, routePoints]);

  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-[28px] bg-sand shadow-inner">
      <div ref={mapRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute left-4 top-4 z-[1000] flex rounded-2xl bg-white/90 p-1 shadow-soft backdrop-blur">
        {[
          { label: "Map", value: "roadmap" as const },
          { label: "Satellite", value: "satellite" as const },
          { label: "Terrain", value: "terrain" as const }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setMapType(option.value)}
            className={twMerge("rounded-xl px-3 py-2 text-xs font-bold", mapType === option.value ? "bg-reef text-white" : "text-ink")}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
