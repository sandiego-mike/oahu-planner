"use client";

import { useState } from "react";
import { Coffee, Heart, Search, Star, Sun, TentTree, Utensils, Waves } from "lucide-react";
import { foodCategories, places } from "@/lib/trip-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function FoodPage() {
  const [query, setQuery] = useState("");
  const foodPlaces = places.filter(
    (p) =>
      p.category === "food" ||
      p.category === "shaved-ice" ||
      p.category === "brewery" ||
      p.category === "farmers-market"
  );
  const visibleFood = foodPlaces.filter((p) =>
    `${p.name} ${p.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Food votes"
          title="Restaurants, treats, and market ideas"
          text="Keep breakfast simple at the resort, then use the board for lunches, dinners, coffee, shave ice, and local stops."
        />
        <div className="mx-auto mb-5 max-w-3xl rounded-3xl bg-white/80 p-3 shadow-soft">
          <label className="flex items-center gap-3 rounded-2xl bg-sand/70 px-4 py-3 text-ink/70">
            <Search size={18} />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search poke, coffee, shrimp trucks, breweries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {foodCategories.map((category, index) => (
            <Card key={category} className="p-5">
              <div className="mb-4 inline-flex rounded-2xl bg-sunrise/20 p-3 text-hibiscus">
                {index % 3 === 0 ? <Coffee /> : index % 3 === 1 ? <Utensils /> : <Waves />}
              </div>
              <h3 className="text-xl font-bold text-ink">{category}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Add recommendations, links, cost notes, and whether it works for a relaxed family pace.
              </p>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-5 grid max-w-6xl gap-3 md:grid-cols-3">
          {visibleFood.slice(0, 12).map((place) => (
            <Card key={place.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-ink">{place.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">{place.tags.join(" · ")}</p>
                </div>
                <Badge>{place.driveFromResort}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sunrise">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="currentColor" />
                ))}
              </div>
            </Card>
          ))}
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
