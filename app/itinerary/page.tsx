"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Heart, Plus, Star, Sun, TentTree, ThumbsUp, Waves } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { activityFilters, days } from "@/lib/trip-data";
import { useData } from "@/components/DataProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CommentBox } from "@/components/CommentBox";
import Link from "next/link";

export default function ItineraryPage() {
  const { comments } = useData();
  const [openDay, setOpenDay] = useState(days[0].id);
  const [activeFilter, setActiveFilter] = useState("All");
  const [wednesdayMode, setWednesdayMode] = useState("Lagoon Challenge");

  const filteredDays =
    activeFilter === "All" ? days : days.filter((day) => day.tags.includes(activeFilter));

  const wednesdayOptions = [
    {
      title: "Lagoon Challenge",
      plan: "Family snorkel check, lagoon walk, pool vote, and sunset photo scavenger hunt.",
      time: "0-10 min driving"
    },
    {
      title: "Local Flavor Loop",
      plan: "Mini Artfest, Makana market, Ko Hana Distillers for adults, and easy Ko Olina dinner.",
      time: "30-60 min driving"
    },
    {
      title: "Golf + Treats",
      plan: "Ko Olina 9-hole or range session, Ululani's dessert vote, and memory wall upload.",
      time: "10-25 min driving"
    }
  ];

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Daily rhythm"
          title="Interactive itinerary"
          text="Early starts, shorter hikes, beach-flexible choices, and room for family voting."
        />
        <div className="mx-auto mb-7 flex max-w-6xl gap-2 overflow-x-auto pb-2 soft-scroll">
          {["All", ...activityFilters].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={twMerge(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition",
                activeFilter === filter
                  ? "bg-reef text-white shadow-soft"
                  : "bg-white/70 text-ink hover:bg-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="mx-auto grid max-w-6xl gap-5">
          {filteredDays.map((day) => {
            const isOpen = openDay === day.id;
            return (
              <Card key={day.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenDay(isOpen ? "" : day.id)}
                  className="grid w-full gap-4 p-4 text-left sm:grid-cols-[180px_1fr_auto] sm:p-5"
                >
                  <div className="h-36 overflow-hidden rounded-3xl sm:h-32">
                    <img
                      src={day.hero}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-hibiscus">{day.date}</p>
                    <h3 className="mt-1 text-2xl font-bold text-ink">{day.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{day.theme}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge>{day.difficulty}</Badge>
                      <Badge>{day.walking}</Badge>
                      {day.teenFriendly && <Badge>Teen-friendly</Badge>}
                      {day.noPermit && (
                        <Badge className="bg-palm/10 text-palm">No permit required</Badge>
                      )}
                      {!day.noPermit && (
                        <Badge className="bg-hibiscus/10 text-hibiscus">Permit review needed</Badge>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={twMerge("self-center text-reef transition", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-reef/10 px-5 pb-5"
                  >
                    <div className="grid gap-5 pt-5 lg:grid-cols-[1.15fr_0.85fr]">
                      <div className="grid gap-3">
                        {day.schedule.map((item) => (
                          <div
                            key={`${day.id}-${item.time}`}
                            className="grid grid-cols-[86px_1fr] gap-3 rounded-2xl bg-sand/70 p-4"
                          >
                            <span className="text-sm font-bold text-reef">{item.time}</span>
                            <span className="text-sm leading-6 text-ink/70">{item.plan}</span>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-3xl bg-lagoon/10 p-5">
                        <div className="grid gap-3 text-sm text-ink/75">
                          <p><strong className="text-ink">Wake-up:</strong> {day.wakeUp}</p>
                          <p><strong className="text-ink">Trail:</strong> {day.trail}</p>
                          <p><strong className="text-ink">Beach:</strong> {day.beach}</p>
                          <p><strong className="text-ink">Food:</strong> {day.food.join(", ")}</p>
                          <p><strong className="text-ink">Optional:</strong> {day.optional.join(", ")}</p>
                          <p><strong className="text-ink">Drive:</strong> {day.driveTime}</p>
                          <p><strong className="text-ink">Parking:</strong> {day.parking}</p>
                          <p><strong className="text-ink">Crowds:</strong> {day.crowdTip}</p>
                        </div>
                      </div>
                    </div>
                    {day.id === "wed-flex" && (
                      <div className="mt-5 rounded-3xl bg-gradient-to-br from-lagoon/15 to-sunrise/20 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-hibiscus">
                              Interactive chill-day builder
                            </p>
                            <h4 className="mt-1 text-2xl font-bold text-ink">
                              Pick Wednesday&apos;s vibe
                            </h4>
                          </div>
                          <Badge>{wednesdayMode}</Badge>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          {wednesdayOptions.map((option) => (
                            <button
                              key={option.title}
                              onClick={() => setWednesdayMode(option.title)}
                              className={twMerge(
                                "rounded-3xl p-4 text-left transition hover:-translate-y-0.5",
                                wednesdayMode === option.title
                                  ? "bg-reef text-white shadow-soft"
                                  : "bg-white/80 text-ink"
                              )}
                            >
                              <span className="text-sm font-bold">{option.title}</span>
                              <span
                                className={twMerge(
                                  "mt-2 block text-sm leading-6",
                                  wednesdayMode === option.title ? "text-white/80" : "text-ink/65"
                                )}
                              >
                                {option.plan}
                              </span>
                              <span
                                className={twMerge(
                                  "mt-3 block text-xs font-bold",
                                  wednesdayMode === option.title ? "text-white/70" : "text-reef"
                                )}
                              >
                                {option.time}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button className="inline-flex items-center gap-2 rounded-full bg-palm/10 px-4 py-2 text-sm font-bold text-palm">
                        <ThumbsUp size={16} /> Vote up
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-full bg-hibiscus/10 px-4 py-2 text-sm font-bold text-hibiscus">
                        Thumbs down
                      </button>
                      <Link
                        href="/suggestions"
                        className="inline-flex items-center gap-2 rounded-full bg-reef px-4 py-2 text-sm font-bold text-white"
                      >
                        <Plus size={16} /> Suggest alternative
                      </Link>
                    </div>
                    <CommentBox itemId={day.id} comments={comments} />
                  </motion.div>
                )}
              </Card>
            );
          })}
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
