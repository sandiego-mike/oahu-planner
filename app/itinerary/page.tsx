"use client";

import { FormEvent, Suspense, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  ChevronDown,
  Cloud,
  Heart,
  Mountain,
  ParkingCircle,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  TentTree,
  ThumbsDown,
  ThumbsUp,
  Users,
  Waves,
  Wind,
  X
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { activityFilters, days } from "@/lib/trip-data";
import { addSuggestion, voteSuggestion } from "@/lib/store";
import { useData } from "@/components/DataProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CommentBox } from "@/components/CommentBox";
import type { ActivityIcon, Category, Suggestion } from "@/lib/types";

const activityIconConfig: Record<ActivityIcon, { icon: React.ElementType; label: string; bg: string; text: string }> = {
  hike:             { icon: TentTree,      label: "Hike",            bg: "bg-palm/10",     text: "text-palm" },
  beach:            { icon: Waves,         label: "Beach",           bg: "bg-lagoon/15",   text: "text-lagoon" },
  market:           { icon: ShoppingBag,   label: "Market",          bg: "bg-hibiscus/10", text: "text-hibiscus" },
  scenic:           { icon: Camera,        label: "Scenic",          bg: "bg-reef/10",     text: "text-reef" },
  sunrise:          { icon: Sunrise,       label: "Early Start",     bg: "bg-sunrise/20",  text: "text-hibiscus" },
  "parking-caution":{ icon: AlertTriangle, label: "Parking Caution", bg: "bg-red-50",      text: "text-red-500" },
};

const crowdColors: Record<string, string> = {
  Low:    "bg-palm/10 text-palm",
  Medium: "bg-sunrise/20 text-hibiscus",
  High:   "bg-red-50 text-red-500",
};

const parkingColors: Record<string, string> = {
  Easy:     "bg-palm/10 text-palm",
  Moderate: "bg-sunrise/20 text-hibiscus",
  Hard:     "bg-red-50 text-red-500",
};

const suggestionCategories: { label: string; value: Category | "general" }[] = [
  { label: "General", value: "general" },
  { label: "Restaurant", value: "food" },
  { label: "Beach", value: "beach" },
  { label: "Trail", value: "trail" },
  { label: "Shaved ice", value: "shaved-ice" },
  { label: "Brewery", value: "brewery" },
];

const reactions = ["👍", "❤️", "🌊", "🍧", "📸"];

/** Suggestions tagged to a specific day use link = "__day:{dayId}" */
function isDaySuggestion(s: Suggestion, dayId: string) {
  return s.link === `__day:${dayId}`;
}

function DaySuggestionForm({ dayId, onClose }: { dayId: string; onClose: () => void }) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "general">("general");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!author.trim() || !title.trim()) return;
    await addSuggestion({
      author,
      title,
      category,
      notes,
      link: `__day:${dayId}`,
      imageUrl: ""
    });
    window.dispatchEvent(new Event("oahu-data-refresh"));
    onClose();
  }

  return (
    <div className="mt-4 rounded-3xl border border-reef/20 bg-white/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-reef">
          <Sparkles size={15} /> Suggest an alternative for this day
        </div>
        <button onClick={onClose} className="rounded-full p-1 text-ink/40 hover:text-ink">
          <X size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-2">
        <input
          className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
          placeholder="Idea title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "general")}
        >
          {suggestionCategories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-reef px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink"
        >
          <Send size={15} /> Submit
        </button>
        <textarea
          className="min-h-20 rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40 sm:col-span-2"
          placeholder="Notes, why it sounds fun, parking tips..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </div>
  );
}

function DaySuggestionsList({ dayId, suggestions }: { dayId: string; suggestions: Suggestion[] }) {
  const daySuggestions = suggestions.filter((s) => isDaySuggestion(s, dayId));
  const [open, setOpen] = useState(false);
  const [localSuggestions, setLocalSuggestions] = useState(daySuggestions);

  // Sync when incoming changes (e.g. after refresh)
  if (JSON.stringify(localSuggestions.map((s) => s.id)) !== JSON.stringify(daySuggestions.map((s) => s.id))) {
    setLocalSuggestions(daySuggestions);
  }

  if (daySuggestions.length === 0) return null;

  function handleVote(suggestion: Suggestion, emoji: string) {
    setLocalSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestion.id
          ? { ...s, votes: { ...s.votes, [emoji]: (s.votes[emoji] ?? 0) + 1 } }
          : s
      )
    );
    voteSuggestion(suggestion, emoji).then(() =>
      window.dispatchEvent(new Event("oahu-data-refresh"))
    );
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-bold text-reef"
      >
        <ChevronDown size={16} className={twMerge("transition", open && "rotate-180")} />
        {daySuggestions.length} family suggestion{daySuggestions.length !== 1 ? "s" : ""} for this day
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-3 grid gap-3"
        >
          {localSuggestions.map((s) => (
            <div key={s.id} className="rounded-2xl bg-white/80 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge>{s.category}</Badge>
                    <span className="text-xs text-ink/45">{s.author}</span>
                  </div>
                  <p className="mt-2 font-bold text-ink">{s.title}</p>
                  {s.notes && <p className="mt-1 text-sm leading-5 text-ink/65">{s.notes}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleVote(s, emoji)}
                    className="rounded-full bg-sand px-3 py-1.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 active:scale-95"
                  >
                    {emoji} {s.votes[emoji] ?? 0}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense>
      <ItineraryContent />
    </Suspense>
  );
}

function ItineraryContent() {
  const { comments, suggestions } = useData();
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const singleDay = dayParam ? days.find((d) => d.id === dayParam) ?? null : null;

  const [openDay, setOpenDay] = useState(singleDay ? singleDay.id : days[0].id);
  const [activeFilter, setActiveFilter] = useState("All");
  const [wednesdayMode, setWednesdayMode] = useState("Lagoon Challenge");
  const [suggestingForDay, setSuggestingForDay] = useState<string | null>(null);

  const filteredDays = singleDay
    ? [singleDay]
    : activeFilter === "All" ? days : days.filter((day) => day.tags.includes(activeFilter));

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
        {singleDay ? (
          <div className="mx-auto max-w-6xl mb-8">
            <Link
              href="/itinerary"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-white"
            >
              <ArrowLeft size={16} /> All days
            </Link>
            <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
              {singleDay.date}
            </h1>
            <p className="mt-2 text-lg font-bold text-reef">{singleDay.title}</p>
          </div>
        ) : (
          <SectionHeading
            eyebrow="Daily rhythm"
            title="Interactive itinerary"
            text="Early starts, shorter hikes, beach-flexible choices, and room for family voting."
          />
        )}
        {!singleDay && (
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
        )}
        <div className="mx-auto grid max-w-6xl gap-5">
          {filteredDays.map((day) => {
            const isOpen = openDay === day.id;
            const isSuggesting = suggestingForDay === day.id;
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
                      {day.crowdLevel && (
                        <Badge className={crowdColors[day.crowdLevel]}>
                          <Users size={11} className="mr-1 inline" />
                          Crowds: {day.crowdLevel}
                        </Badge>
                      )}
                      {day.parkingDifficulty && (
                        <Badge className={parkingColors[day.parkingDifficulty]}>
                          <ParkingCircle size={11} className="mr-1 inline" />
                          Parking: {day.parkingDifficulty}
                        </Badge>
                      )}
                    </div>
                    {day.activityIcons && day.activityIcons.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {day.activityIcons.map((icon) => {
                          const cfg = activityIconConfig[icon];
                          const Icon = cfg.icon;
                          return (
                            <span
                              key={icon}
                              className={twMerge("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", cfg.bg, cfg.text)}
                            >
                              <Icon size={12} />
                              {cfg.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
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
                    {/* Early start warning banner */}
                    {day.earlyStart && (
                      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-sunrise/20 px-4 py-3">
                        <Sunrise size={18} className="mt-0.5 shrink-0 text-hibiscus" />
                        <div>
                          <p className="text-sm font-bold text-hibiscus">Early Start Required</p>
                          <p className="mt-0.5 text-sm text-ink/70">{day.wakeUp}</p>
                        </div>
                      </div>
                    )}

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
                      <div className="grid gap-3">
                        <div className="rounded-3xl bg-lagoon/10 p-5">
                          <div className="grid gap-3 text-sm text-ink/75">
                            {!day.earlyStart && (
                              <p><strong className="text-ink">Wake-up:</strong> {day.wakeUp}</p>
                            )}
                            <p><strong className="text-ink">Trail:</strong> {day.trail}</p>
                            <p><strong className="text-ink">Beach:</strong> {day.beach}</p>
                            <p><strong className="text-ink">Food:</strong> {day.food.join(", ")}</p>
                            <p><strong className="text-ink">Optional:</strong> {day.optional.join(", ")}</p>
                            <p><strong className="text-ink">Drive:</strong> {day.driveTime}</p>
                            <p><strong className="text-ink">Parking:</strong> {day.parking}</p>
                            <p><strong className="text-ink">Crowds:</strong> {day.crowdTip}</p>
                          </div>
                        </div>

                        {/* Enhanced conditions panel */}
                        {(day.weatherNote || day.bestLightingWindow || day.tradeWindFriendly !== undefined) && (
                          <div className="rounded-3xl bg-sky-50 p-5">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
                              Conditions &amp; Timing
                            </p>
                            <div className="grid gap-2.5 text-sm text-ink/75">
                              {day.weatherNote && (
                                <div className="flex items-start gap-2">
                                  <Sun size={14} className="mt-0.5 shrink-0 text-hibiscus" />
                                  <span>{day.weatherNote}</span>
                                </div>
                              )}
                              {day.bestLightingWindow && (
                                <div className="flex items-start gap-2">
                                  <Camera size={14} className="mt-0.5 shrink-0 text-reef" />
                                  <span><strong className="text-ink">Best light:</strong> {day.bestLightingWindow}</span>
                                </div>
                              )}
                              {day.tradeWindFriendly !== undefined && (
                                <div className="flex items-start gap-2">
                                  <Wind size={14} className="mt-0.5 shrink-0 text-sky-500" />
                                  <span>
                                    <strong className="text-ink">Trade winds:</strong>{" "}
                                    {day.tradeWindFriendly ? "Trade wind friendly — expect cooling breezes." : "Leeward / sheltered — less wind, warmer."}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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

                    {/* Vote + Suggest alternative */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button className="inline-flex items-center gap-2 rounded-full bg-palm/10 px-4 py-2 text-sm font-bold text-palm">
                        <ThumbsUp size={16} /> Vote up
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-full bg-hibiscus/10 px-4 py-2 text-sm font-bold text-hibiscus">
                        <ThumbsDown size={16} /> Vote down
                      </button>
                      {!isSuggesting && (
                        <button
                          onClick={() => setSuggestingForDay(day.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-reef px-4 py-2 text-sm font-bold text-white"
                        >
                          <Plus size={16} /> Suggest alternative
                        </button>
                      )}
                    </div>

                    {/* Inline suggestion form for this day */}
                    {isSuggesting && (
                      <DaySuggestionForm
                        dayId={day.id}
                        onClose={() => setSuggestingForDay(null)}
                      />
                    )}

                    {/* Suggestions submitted for this day */}
                    <DaySuggestionsList dayId={day.id} suggestions={suggestions} />

                    {/* Comments */}
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
