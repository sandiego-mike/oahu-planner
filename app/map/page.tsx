"use client";

import { useState } from "react";
import { Heart, Search, Star, Sun, TentTree, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { days, places, resort, routePlans } from "@/lib/trip-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeafletMap, allMapPoints } from "@/components/LeafletMap";
import type { Category } from "@/lib/types";

function pointById(id: string) {
  const points = allMapPoints();
  return points.find((p) => p.id === id);
}

function RouteMapSection() {
  const [selectedDay, setSelectedDay] = useState(routePlans[0].dayId);
  const [activeType, setActiveType] = useState("all");
  const selectedRoute = routePlans.find((r) => r.dayId === selectedDay) ?? routePlans[0];
  const points = allMapPoints();
  const visibleStopIds = new Set(selectedRoute.stops);
  const selectedDayMeta = days.find((d) => d.id === selectedRoute.dayId);
  const routePoints = selectedRoute.stops
    .map((id) => pointById(id))
    .filter(Boolean) as Array<{ lat: number; lng: number; id: string; name: string; address?: string }>;
  const routeStartAddress = resort.address;
  const routeEndAddress =
    routePoints.length > 1
      ? routePoints[routePoints.length - 1].address || routePoints[routePoints.length - 1].name
      : resort.address;
  const routeDirectionsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(routeStartAddress)}&destination=${encodeURIComponent(routeEndAddress)}`;
  const nearbyPoints = points
    .filter(
      (p) =>
        !visibleStopIds.has(p.id) &&
        ["food", "brewery", "distillery", "farmers-market", "made-in-hawaii", "golf", "shaved-ice"].includes(p.type)
    )
    .filter((p) => activeType === "all" || p.type === activeType)
    .slice(0, 10);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Island routes"
        title="Daily route map"
        text="Choose a day to show that day's route, nearby eateries, golf, breweries, farmers markets, Made in Hawaii stops, and scenic pins."
      />
      <div className="mx-auto max-w-6xl">
        <Card className="mb-5 p-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {routePlans.map((route) => {
              const meta = days.find((d) => d.id === route.dayId);
              const label = meta?.date.split(",")[0] ?? route.label;
              return (
                <button
                  key={route.dayId}
                  onClick={() => setSelectedDay(route.dayId)}
                  className={twMerge(
                    "rounded-2xl px-3 py-3 text-left transition",
                    selectedDay === route.dayId ? "text-white shadow-soft" : "bg-sand text-ink hover:bg-white"
                  )}
                  style={selectedDay === route.dayId ? { background: route.color } : undefined}
                >
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] opacity-75">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-tight">
                    {route.label.replace(/^Day \d+\s*/, "")}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden p-4">
          <div className="mb-4 rounded-[24px] bg-white/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: `${selectedRoute.color}22`,
                    color: selectedRoute.color
                  }}
                >
                  {selectedDayMeta?.date ?? selectedRoute.label}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-ink">{selectedRoute.label} route</h3>
                <p className="mt-1 text-sm text-ink/65">
                  {selectedRoute.totalDrive} · {selectedRoute.leaveBy}
                </p>
              </div>
              <a
                href={routeDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-reef px-4 py-3 text-sm font-bold text-white"
              >
                Open route
              </a>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-sand/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Start address</p>
                <p className="mt-2 text-sm font-semibold text-ink">{routeStartAddress}</p>
              </div>
              <div className="rounded-2xl bg-sand/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/50">End address</p>
                <p className="mt-2 text-sm font-semibold text-ink">{routeEndAddress}</p>
              </div>
            </div>
          </div>
          <LeafletMap
            activeType={activeType}
            nearbyPoints={nearbyPoints}
            route={selectedRoute}
            routePoints={routePoints}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "all",
              "beach",
              "trail",
              "food",
              "brewery",
              "distillery",
              "shaved-ice",
              "farmers-market",
              "made-in-hawaii",
              "golf",
              "resort",
              "scenic"
            ].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={twMerge(
                  "rounded-full px-3 py-2 text-xs font-bold capitalize",
                  activeType === type ? "bg-reef text-white" : "bg-sand text-ink"
                )}
              >
                {type.replace("-", " ")}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          <Card className="p-5">
            <h3 className="text-2xl font-bold text-ink">{selectedRoute.label} details</h3>
            <p className="mt-2 text-sm text-ink/65">
              <strong>Leave by:</strong> {selectedRoute.leaveBy}
            </p>
            <p className="mt-1 text-sm text-ink/65">
              <strong>Drive:</strong> {selectedRoute.totalDrive}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink/65">{selectedRoute.trafficNote}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedRoute.parkingWarnings.map((warning) => (
                <span
                  key={warning}
                  className="rounded-full bg-hibiscus/10 px-3 py-2 text-xs font-bold text-hibiscus"
                >
                  {warning}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              {routePoints.map((point, index) => (
                <a
                  key={`${point.id}-${index}`}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${point.name} ${"address" in point ? point.address : ""}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid grid-cols-[28px_1fr] items-center gap-3 rounded-2xl bg-sand/70 px-3 py-3 text-sm font-bold text-ink"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                    style={{ background: selectedRoute.color }}
                  >
                    {index + 1}
                  </span>
                  {point.name}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const filtered = filter === "all" ? places : places.filter((p) => p.category === filter);
  const [surf, setSurf] = useState("Calm");
  const [wind, setWind] = useState("Light");
  const [tide, setTide] = useState("Mid");
  const safeToSnorkel = surf === "Calm" && wind !== "Strong";

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Ocean check"
        title="Snorkeling + drive-time guide"
        text="Start with a simple conditions check, then scan route-friendly beaches, food, breweries, Made in Hawaii stops, golf, and resort anchors."
      />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <div className="overflow-hidden rounded-[24px]">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Lanikai%20Beach.jpg?width=1200"
                alt="Tropical Oahu beach"
                className="h-80 w-full object-cover"
              />
            </div>
            <div>
              <Badge
                className={
                  safeToSnorkel ? "bg-palm/10 text-palm" : "bg-hibiscus/10 text-hibiscus"
                }
              >
                {safeToSnorkel ? "Best today: Ko Olina Lagoons" : "Use caution today"}
              </Badge>
              <h3 className="mt-4 text-3xl font-bold text-ink">Snorkeling conditions check</h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                Best family-friendly default: Ko Olina Lagoons. Best adventure option only when calm:
                Shark&apos;s Cove. If surf, wind, visibility, or lifeguard guidance feels off, make it a
                beach walk instead.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Surf
                  <select
                    className="mt-2 w-full rounded-2xl border border-reef/10 bg-white px-3 py-3 text-sm normal-case tracking-normal text-ink outline-none"
                    value={surf}
                    onChange={(e) => setSurf(e.target.value)}
                  >
                    {["Calm", "Moderate", "Rough"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Wind
                  <select
                    className="mt-2 w-full rounded-2xl border border-reef/10 bg-white px-3 py-3 text-sm normal-case tracking-normal text-ink outline-none"
                    value={wind}
                    onChange={(e) => setWind(e.target.value)}
                  >
                    {["Light", "Breezy", "Strong"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Tide
                  <select
                    className="mt-2 w-full rounded-2xl border border-reef/10 bg-white px-3 py-3 text-sm normal-case tracking-normal text-ink outline-none"
                    value={tide}
                    onChange={(e) => setTide(e.target.value)}
                  >
                    {["Low", "Mid", "High"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-5 rounded-3xl bg-sand/70 p-4">
                <p className="text-sm font-bold text-ink">
                  {safeToSnorkel
                    ? "Plan: lagoon snorkel window"
                    : "Plan: swim/walk only unless conditions improve"}
                </p>
                <p className="mt-1 text-sm leading-6 text-ink/65">
                  Check lifeguard signs, surf report, wind, and visibility before entering. For teens,
                  pair short snorkel time with beach games so it stays fun and low-stress.
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              "all",
              "resort",
              "trail",
              "beach",
              "food",
              "shaved-ice",
              "farmers-market",
              "brewery",
              "distillery",
              "made-in-hawaii",
              "golf"
            ].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item as Category | "all")}
                className={twMerge(
                  "rounded-full px-3 py-2 text-xs font-bold capitalize",
                  filter === item ? "bg-reef text-white" : "bg-sand text-ink"
                )}
              >
                {item.replace("-", " ")}
              </button>
            ))}
          </div>
          <div className="grid max-h-[430px] gap-3 overflow-auto pr-1 soft-scroll">
            {filtered.map((place) => (
              <div key={place.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{place.name}</h3>
                    <p className="mt-1 text-xs text-ink/55">{place.address}</p>
                  </div>
                  <Badge>{place.driveFromResort}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {place.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-lagoon/10 px-2 py-1 text-[11px] font-bold text-reef"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

export default function MapPage() {
  return (
    <main className="min-h-screen">
      <RouteMapSection />
      <MapSection />

      <footer className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[28px] bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Ready for Ko Olina.</p>
            <p className="mt-1 text-sm text-white/65">
              Early mornings, flexible afternoons, and a shared place for every good idea.
            </p>
          </div>
          <div className="flex gap-2 text-sunrise">
            <Sun /><Waves /><TentTree /><Heart /><Star />
          </div>
        </div>
      </footer>
    </main>
  );
}
