"use client";

import { useState } from "react";
import { Heart, Star, Sun, TentTree, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { trails } from "@/lib/trip-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function TrailsPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [permitFilter, setPermitFilter] = useState<string>("All");

  const visible = trails.filter((trail) => {
    const matchDifficulty = difficultyFilter === "All" || trail.difficulty === difficultyFilter;
    const matchPermit = permitFilter === "All" || trail.permit === permitFilter;
    return matchDifficulty && matchPermit;
  });

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="No-stress adventure"
          title="Trail explorer"
          text="Teen-friendly, short, scenic trail candidates with mud, stream, permit, parking, food, and beach pairing notes."
        />

        {/* Filters */}
        <div className="mx-auto mb-7 max-w-6xl">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink/60">Difficulty:</span>
              {["All", "Easy", "Easy-Moderate", "Moderate"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={twMerge(
                    "rounded-full px-3 py-2 text-xs font-bold",
                    difficultyFilter === level
                      ? "bg-reef text-white"
                      : "bg-white/70 text-ink hover:bg-white"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink/60">Permit:</span>
              {["All", "No permit", "Permit required"].map((status) => (
                <button
                  key={status}
                  onClick={() => setPermitFilter(status)}
                  className={twMerge(
                    "rounded-full px-3 py-2 text-xs font-bold",
                    permitFilter === status
                      ? "bg-reef text-white"
                      : "bg-white/70 text-ink hover:bg-white"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {visible.map((trail) => (
            <Card key={trail.id} className="overflow-hidden">
              <div className="grid sm:grid-cols-[190px_1fr]">
                <img src={trail.image} alt="" className="h-full min-h-56 w-full object-cover" />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        trail.permit === "Permit required"
                          ? "bg-hibiscus/10 text-hibiscus"
                          : "bg-palm/10 text-palm"
                      }
                    >
                      {trail.permit}
                    </Badge>
                    <Badge>{trail.difficulty}</Badge>
                    <Badge>{trail.distance}</Badge>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-ink">{trail.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{trail.notes}</p>
                  <div className="mt-4 grid gap-2 text-sm text-ink/70">
                    <p><strong className="text-ink">Time:</strong> {trail.time}</p>
                    <p>
                      <strong className="text-ink">Mud:</strong> {trail.mud} ·{" "}
                      <strong className="text-ink">Streams:</strong> {trail.streams}
                    </p>
                    <p>
                      <strong className="text-ink">Crowd/Parking:</strong> {trail.crowd} / {trail.parking}
                    </p>
                    <p><strong className="text-ink">Nearby food:</strong> {trail.nearbyFood}</p>
                    <p><strong className="text-ink">Beach pairing:</strong> {trail.beachPairing}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {visible.length === 0 && (
            <p className="col-span-full py-10 text-center text-ink/50">
              No trails match the current filters.
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
