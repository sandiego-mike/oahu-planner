"use client";

import { useState } from "react";
import { Heart, Star, Sun, TentTree, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { madeInHawaiiLocations } from "@/lib/trip-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function MadeInHawaiiPage() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(madeInHawaiiLocations[0]?.id ?? "");
  const categories = [
    "all",
    "coffee",
    "macadamia",
    "cacao",
    "brewery",
    "distillery",
    "pineapple",
    "food-production",
    "shave-ice",
    "poke",
    "shrimp"
  ];
  const visible = madeInHawaiiLocations.filter(
    (loc) => filter === "all" || loc.category === filter
  );
  const selected =
    madeInHawaiiLocations.find((loc) => loc.id === selectedId) ??
    visible[0] ??
    madeInHawaiiLocations[0];

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Authentic local experiences"
          title="Made in Hawaii"
          text="Production-forward stops: coffee, cacao, pineapple, macadamia nuts, local breweries/distilleries, poke, shrimp trucks, and shave ice."
        />
        <div className="mx-auto mb-5 flex max-w-6xl gap-2 overflow-x-auto pb-2 soft-scroll">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={twMerge(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold capitalize",
                filter === category ? "bg-reef text-white" : "bg-white/80 text-ink"
              )}
            >
              {category.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((location) => (
              <Card
                key={location.id}
                className={twMerge(
                  "overflow-hidden transition hover:-translate-y-1",
                  selected.id === location.id && "ring-2 ring-reef"
                )}
              >
                <button onClick={() => setSelectedId(location.id)} className="w-full text-left">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {location.photoGallery.slice(0, 2).map((photo) => (
                      <img
                        key={photo}
                        src={photo}
                        alt=""
                        className="h-28 w-full rounded-2xl object-cover"
                      />
                    ))}
                  </div>
                  <div className="p-5 pt-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{location.category.replace("-", " ")}</Badge>
                      {location.onsiteProduction && (
                        <Badge className="bg-palm/10 text-palm">Onsite production</Badge>
                      )}
                      {location.familyFriendly && <Badge>Family friendly</Badge>}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-ink">{location.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{location.notes}</p>
                    <div className="mt-3 grid gap-1 text-xs text-ink/60">
                      <p><strong className="text-ink">Tasting:</strong> {location.tasting}</p>
                      <p><strong className="text-ink">Duration:</strong> {location.duration}</p>
                      <p><strong className="text-ink">Scenic value:</strong> {location.scenicValue}/5</p>
                      <p>
                        <strong className="text-ink">Fits:</strong>{" "}
                        {location.itineraryCompatibility.join(", ")}
                      </p>
                    </div>
                  </div>
                </button>
              </Card>
            ))}
          </div>
          <Card className="overflow-hidden p-3">
            <iframe
              title="Made in Hawaii map"
              className="h-[410px] w-full rounded-[24px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(selected.mapQuery)}&output=embed`}
            />
            <div className="p-4">
              <h3 className="text-2xl font-bold text-ink">{selected.name}</h3>
              <p className="mt-1 text-sm text-ink/65">{selected.address}</p>
              <p className="mt-3 text-sm leading-6 text-ink/70">{selected.notes}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-2xl bg-reef px-4 py-3 font-bold text-white"
              >
                Open map
              </a>
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
