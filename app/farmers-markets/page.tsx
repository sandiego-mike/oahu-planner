"use client";

import { useState } from "react";
import { Heart, Search, Star, Sun, TentTree, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { adHocFarmersMarkets, farmerMarkets } from "@/lib/trip-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function FarmersMarketsPage() {
  const [query, setQuery] = useState("");
  const [day, setDay] = useState("All");
  const [selectedId, setSelectedId] = useState(farmerMarkets[0]?.id ?? "");
  const dayOptions = [
    "All",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const visibleMarkets = farmerMarkets.filter((market) => {
    const matchesDay = day === "All" || market.days.includes(day);
    const searchable =
      `${market.name} ${market.location} ${market.address} ${market.region} ${market.recommendedStop}`.toLowerCase();
    return matchesDay && searchable.includes(query.toLowerCase());
  });

  const selected =
    farmerMarkets.find((m) => m.id === selectedId) ?? visibleMarkets[0] ?? farmerMarkets[0];

  const alignedMarkets = farmerMarkets
    .filter((m) =>
      m.bestItineraryDays.some((match) =>
        ["Saturday", "Sunday", "Monday", "Wednesday", "Thursday", "Friday"].includes(match)
      )
    )
    .slice(0, 6);

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Local produce + treats"
          title="Farmers markets database"
          text="Search every recurring market from the Oʻahu weekly schedule, filter by day, and find route-friendly stops."
        />

        <div className="mx-auto mb-5 grid max-w-6xl gap-3 md:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 rounded-3xl bg-white/85 px-4 py-3 shadow-soft text-ink/70">
            <Search size={18} />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search markets, regions, addresses, route notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            className="rounded-3xl border border-reef/10 bg-white/85 px-4 py-3 font-bold text-ink shadow-soft outline-none"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            {dayOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="overflow-hidden p-3">
            <iframe
              title="Selected farmers market map"
              className="h-[420px] w-full rounded-[24px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${selected.name} ${selected.address}`)}&output=embed`}
            />
            <div className="p-3">
              <h3 className="text-2xl font-bold text-ink">{selected.name}</h3>
              <p className="mt-1 text-sm text-ink/65">
                {selected.days.join(", ")} · {selected.hours}
              </p>
              <p className="mt-1 text-sm text-ink/65">{selected.address}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{selected.region}</Badge>
                <Badge>{selected.driveFromResort}</Badge>
                {selected.bestItineraryDays.map((match) => (
                  <Badge key={match} className="bg-palm/10 text-palm">
                    Best: {match}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex max-h-[640px] flex-col gap-3 overflow-auto pr-1 soft-scroll">
            {visibleMarkets.map((market) => (
              <Card
                key={market.id}
                className={twMerge(
                  "cursor-pointer p-4 transition hover:-translate-y-0.5",
                  selected.id === market.id && "ring-2 ring-reef"
                )}
              >
                <button onClick={() => setSelectedId(market.id)} className="block w-full text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-ink">{market.name}</h3>
                      <p className="mt-1 text-sm text-ink/65">
                        {market.days.join(", ")} · {market.hours}
                      </p>
                      <p className="mt-1 text-xs text-ink/55">
                        {market.location} · {market.region}
                      </p>
                    </div>
                    <Badge className="shrink-0">{market.driveFromResort}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{market.recommendedStop}</p>
                  <div className="mt-3 grid gap-1 text-xs text-ink/60">
                    <p>
                      <strong className="text-ink">Nearby beach:</strong>{" "}
                      {market.nearby.beaches.join(", ")}
                    </p>
                    <p>
                      <strong className="text-ink">Nearby trail:</strong>{" "}
                      {market.nearby.trails.join(", ")}
                    </p>
                    <p>
                      <strong className="text-ink">Nearby food:</strong>{" "}
                      {market.nearby.food.join(", ")}
                    </p>
                  </div>
                  {market.parkingWarning && (
                    <p className="mt-2 rounded-2xl bg-hibiscus/10 px-3 py-2 text-xs font-bold text-hibiscus">
                      {market.parkingWarning}
                    </p>
                  )}
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl">
          <h3 className="mb-3 text-xl font-bold text-ink">Recommended route-fit stops</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {alignedMarkets.map((market) => (
              <Card key={`aligned-${market.id}`} className="p-4">
                <Badge>{market.bestItineraryDays.join(" / ")}</Badge>
                <h4 className="mt-3 font-bold text-ink">{market.name}</h4>
                <p className="mt-2 text-sm leading-6 text-ink/65">{market.recommendedStop}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl">
          <Card className="p-5">
            <h3 className="text-xl font-bold text-ink">Other source-listed ad-hoc markets</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              These appear on the source page as ad-hoc markets, so the site lists them for future
              planning but does not assign recurring hours or route pins until a specific event date is
              chosen.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {adHocFarmersMarkets.map((market) => (
                <span key={market} className="rounded-full bg-sand px-3 py-2 text-xs font-bold text-ink">
                  {market}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </section>

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
