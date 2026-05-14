"use client";

import { useState } from "react";
import { Heart, Star, Sun, TentTree, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { beaches } from "@/lib/trip-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function BeachesPage() {
  const [crowdFilter, setCrowdFilter] = useState<string>("All");
  const [parkingFilter, setParkingFilter] = useState<string>("All");
  const [minFamily, setMinFamily] = useState(0);

  const visible = beaches.filter((beach) => {
    const matchCrowd = crowdFilter === "All" || beach.crowd === crowdFilter;
    const matchParking = parkingFilter === "All" || beach.parking === parkingFilter;
    const matchFamily = beach.familyScore >= minFamily;
    return matchCrowd && matchParking && matchFamily;
  });

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Beach scout"
          title="Beach explorer"
          text="Visual cards for family fit, parking stress, amenities, swimming notes, and sunset potential."
        />

        {/* Filters */}
        <div className="mx-auto mb-7 max-w-6xl">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink/60">Crowd:</span>
              {["All", "Low", "Medium", "High"].map((level) => (
                <button
                  key={level}
                  onClick={() => setCrowdFilter(level)}
                  className={twMerge(
                    "rounded-full px-3 py-2 text-xs font-bold",
                    crowdFilter === level ? "bg-reef text-white" : "bg-white/70 text-ink hover:bg-white"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink/60">Parking:</span>
              {["All", "Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setParkingFilter(level)}
                  className={twMerge(
                    "rounded-full px-3 py-2 text-xs font-bold",
                    parkingFilter === level ? "bg-reef text-white" : "bg-white/70 text-ink hover:bg-white"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink/60">Min family score:</span>
              {[0, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => setMinFamily(score)}
                  className={twMerge(
                    "rounded-full px-3 py-2 text-xs font-bold",
                    minFamily === score ? "bg-reef text-white" : "bg-white/70 text-ink hover:bg-white"
                  )}
                >
                  {score === 0 ? "Any" : `${score}+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((beach) => (
            <Card key={beach.id} className="overflow-hidden">
              <img src={beach.image} alt="" className="h-52 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-bold text-ink">{beach.name}</h3>
                  <Badge>{beach.crowd} crowd</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/65">{beach.notes}</p>
                <div className="mt-4 grid gap-2 text-sm text-ink/70">
                  <p><strong className="text-ink">Parking:</strong> {beach.parking}</p>
                  <p><strong className="text-ink">Snorkeling:</strong> {beach.snorkeling}</p>
                  <p><strong className="text-ink">Swimming:</strong> {beach.swimming}</p>
                  <p><strong className="text-ink">Amenities:</strong> {beach.amenities}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>Family {beach.familyScore}/5</Badge>
                  <Badge className="bg-sunrise/20 text-hibiscus">Sunset {beach.sunsetScore}/5</Badge>
                </div>
              </div>
            </Card>
          ))}
          {visible.length === 0 && (
            <p className="col-span-full py-10 text-center text-ink/50">
              No beaches match the current filters.
            </p>
          )}
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
