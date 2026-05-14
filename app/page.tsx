"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Bell,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Clock,
  CloudSun,
  Coffee,
  Heart,
  MapPin,
  MessageCircle,
  Moon,
  Navigation,
  Palmtree,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Sun,
  TentTree,
  ThumbsUp,
  Utensils,
  Waves
} from "lucide-react";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";
import {
  activityFilters,
  adHocFarmersMarkets,
  beaches,
  days,
  farmerMarkets,
  foodCategories,
  golfCourses,
  madeInHawaiiLocations,
  packingItems,
  places,
  resort,
  routePlans,
  trails,
  tripStart
} from "@/lib/trip-data";
import {
  addComment,
  addSuggestion,
  subscribeComments,
  subscribeSuggestions,
  voteSuggestion
} from "@/lib/store";
import type { Category, Interest, Suggestion, TripComment } from "@/lib/types";

const categories: { label: string; value: Category | "general" | "memory" }[] = [
  { label: "General", value: "general" },
  { label: "Restaurant", value: "food" },
  { label: "Beach", value: "beach" },
  { label: "Trail", value: "trail" },
  { label: "Shaved ice", value: "shaved-ice" },
  { label: "Brewery", value: "brewery" },
  { label: "Memory", value: "memory" }
];

const reactions = ["👍", "❤️", "🌊", "🍧", "📸"];

function Card({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={twMerge("rounded-[28px] bg-white/85 shadow-soft ring-1 ring-white/70", className)}>{children}</div>;
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={twMerge("inline-flex items-center rounded-full bg-lagoon/10 px-3 py-1 text-xs font-semibold text-reef", className)}>
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto mb-7 max-w-3xl text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-hibiscus">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold text-ink sm:text-5xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-ink/70">{text}</p>
    </div>
  );
}

function Countdown() {
  const start = new Date(tripStart);
  const daysAway = differenceInDays(start, new Date());
  const label = daysAway > 0 ? `${daysAway} days to go` : `Trip started ${formatDistanceToNowStrict(start)} ago`;

  return (
    <Card className="glass p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-sunrise/20 p-3 text-hibiscus">
          <CalendarDays size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink/60">May 22-29</p>
          <p className="text-2xl font-bold text-ink">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function WeatherWidget() {
  return (
    <Card className="glass p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-lagoon/15 p-3 text-reef">
          <CloudSun size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink/60">Ko Olina outlook</p>
          <p className="text-2xl font-bold text-ink">Warm, breezy, 76-86°F</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/65">Pack water, hats, and reef-safe sunscreen. Check surf and rain each morning before beach or trail choices.</p>
    </Card>
  );
}

function FeaturedActivities() {
  const featured = [
    { title: "Judd Trail", detail: "Short shaded jungle loop", icon: <TentTree size={18} /> },
    { title: "Kailua Beach Park", detail: "Roomier windward beach choice", icon: <Waves size={18} /> },
    { title: "Ululani's Shave Ice", detail: "Family dessert vote leader", icon: <Star size={18} /> },
    { title: "Ko Olina Lagoons", detail: "Recovery day, sunset, easy logistics", icon: <Sun size={18} /> }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % featured.length), 3200);
    return () => window.clearInterval(timer);
  }, [featured.length]);

  const item = featured[index];
  return (
    <Card className="glass p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-hibiscus/15 p-3 text-hibiscus">{item.icon}</div>
        <div>
          <p className="text-sm font-semibold text-ink/60">Featured activity</p>
          <motion.p key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-ink">
            {item.title}
          </motion.p>
          <p className="text-sm text-ink/65">{item.detail}</p>
        </div>
      </div>
    </Card>
  );
}

function SuggestionForm({ compact = false }: { compact?: boolean }) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "general" | "memory">("general");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!author.trim() || !title.trim()) return;
    await addSuggestion({
      author,
      title,
      category,
      notes,
      link,
      imageUrl
    });
    setTitle("");
    setNotes("");
    setLink("");
    setImageUrl("");
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  return (
    <form onSubmit={handleSubmit} className={twMerge("grid gap-3", compact ? "" : "md:grid-cols-2")}>
      <input className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40" placeholder="Your name" value={author} onChange={(event) => setAuthor(event.target.value)} />
      <input className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40" placeholder="Idea title" value={title} onChange={(event) => setTitle(event.target.value)} />
      <select className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40" value={category} onChange={(event) => setCategory(event.target.value as Category | "general" | "memory")}>
        {categories.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
      <input className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40" placeholder="Optional link" value={link} onChange={(event) => setLink(event.target.value)} />
      {!compact && (
        <input className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40 md:col-span-2" placeholder="Optional photo URL for memory wall" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
      )}
      <textarea className="min-h-24 rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40 md:col-span-2" placeholder="Notes, parking tips, why it sounds fun..." value={notes} onChange={(event) => setNotes(event.target.value)} />
      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-reef px-5 py-3 font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink md:col-span-2">
        <Send size={18} /> Submit idea
      </button>
    </form>
  );
}

function SuggestionsBoard({ suggestions: incoming }: { suggestions: Suggestion[] }) {
  const [local, setLocal] = useState<Suggestion[]>(incoming);
  useEffect(() => { setLocal(incoming); }, [incoming]);

  function handleVote(suggestion: Suggestion, emoji: string) {
    setLocal((prev) =>
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
    <div className="grid gap-4 md:grid-cols-3">
      {local.map((suggestion) => (
        <Card key={suggestion.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <Badge>{suggestion.category}</Badge>
            <span className="text-xs font-semibold text-ink/45">{suggestion.author}</span>
          </div>
          <h3 className="mt-4 text-xl font-bold text-ink">{suggestion.title}</h3>
          <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{suggestion.notes}</p>
          {suggestion.link && (
            <a className="mt-3 inline-flex text-sm font-bold text-reef underline-offset-4 hover:underline" href={suggestion.link} target="_blank" rel="noreferrer">Open link</a>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {reactions.map((emoji) => (
              <button key={emoji} onClick={() => handleVote(suggestion, emoji)} className="rounded-full bg-sand px-3 py-1.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 active:scale-95">
                {emoji} {suggestion.votes[emoji] ?? 0}
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function CommentBox({ itemId, comments }: { itemId: string; comments: TripComment[] }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [reaction, setReaction] = useState("👍");
  const [interest, setInterest] = useState<Interest>("interested");
  const dayComments = comments.filter((comment) => comment.itemId === itemId);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!author.trim() || !text.trim()) return;
    await addComment({ itemId, author, text, reaction, interest });
    setText("");
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  return (
    <div className="mt-5 rounded-3xl bg-sand/70 p-4">
      <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-[1fr_1.5fr_auto_auto_auto]">
        <input className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lagoon/40" placeholder="Name" value={author} onChange={(event) => setAuthor(event.target.value)} />
        <input className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lagoon/40" placeholder="Comment or suggestion" value={text} onChange={(event) => setText(event.target.value)} />
        <select className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none" value={reaction} onChange={(event) => setReaction(event.target.value)}>
          {reactions.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none" value={interest} onChange={(event) => setInterest(event.target.value as Interest)}>
          <option value="maybe">Maybe</option>
          <option value="interested">Interested</option>
          <option value="must-do">Must-do</option>
        </select>
        <button aria-label="Add comment" className="inline-flex items-center justify-center rounded-2xl bg-reef px-4 py-2 text-white transition hover:bg-ink">
          <Plus size={18} />
        </button>
      </form>
      <div className="mt-4 grid gap-2">
        {dayComments.map((comment) => (
          <div key={comment.id} className="rounded-2xl bg-white/80 px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2 font-bold text-ink">
              <span>{comment.reaction}</span>
              <span>{comment.author}</span>
              <Badge className="bg-white text-palm">{comment.interest}</Badge>
            </div>
            <p className="mt-1 text-ink/70">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Itinerary({ comments }: { comments: TripComment[] }) {
  const [openDay, setOpenDay] = useState(days[0].id);
  const [activeFilter, setActiveFilter] = useState("All");
  const [wednesdayMode, setWednesdayMode] = useState("Lagoon Challenge");
  const filteredDays = activeFilter === "All" ? days : days.filter((day) => day.tags.includes(activeFilter));
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
    <section id="itinerary" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Daily rhythm" title="Interactive itinerary" text="Early starts, shorter hikes, beach-flexible choices, and room for family voting." />
      <div className="mx-auto mb-7 flex max-w-6xl gap-2 overflow-x-auto pb-2 soft-scroll">
        {["All", ...activityFilters].map((filter) => (
          <button key={filter} onClick={() => setActiveFilter(filter)} className={twMerge("whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition", activeFilter === filter ? "bg-reef text-white shadow-soft" : "bg-white/70 text-ink hover:bg-white")}>
            {filter}
          </button>
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-5">
        {filteredDays.map((day) => {
          const isOpen = openDay === day.id;
          return (
            <Card key={day.id} className="overflow-hidden">
              <button onClick={() => setOpenDay(isOpen ? "" : day.id)} className="grid w-full gap-4 p-4 text-left sm:grid-cols-[180px_1fr_auto] sm:p-5">
                <div className="h-36 overflow-hidden rounded-3xl sm:h-32">
                  <img src={day.hero} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                </div>
                <div>
                  <p className="text-sm font-bold text-hibiscus">{day.date}</p>
                  <h3 className="mt-1 text-2xl font-bold text-ink">{day.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{day.theme}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{day.difficulty}</Badge>
                    <Badge>{day.walking}</Badge>
                    {day.teenFriendly && <Badge>Teen-friendly</Badge>}
                    {day.noPermit && <Badge className="bg-palm/10 text-palm">No permit required</Badge>}
                    {!day.noPermit && <Badge className="bg-hibiscus/10 text-hibiscus">Permit review needed</Badge>}
                  </div>
                </div>
                <ChevronDown className={twMerge("self-center text-reef transition", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-reef/10 px-5 pb-5">
                  <div className="grid gap-5 pt-5 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="grid gap-3">
                      {day.schedule.map((item) => (
                        <div key={`${day.id}-${item.time}`} className="grid grid-cols-[86px_1fr] gap-3 rounded-2xl bg-sand/70 p-4">
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
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-hibiscus">Interactive chill-day builder</p>
                          <h4 className="mt-1 text-2xl font-bold text-ink">Pick Wednesday&apos;s vibe</h4>
                        </div>
                        <Badge>{wednesdayMode}</Badge>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {wednesdayOptions.map((option) => (
                          <button
                            key={option.title}
                            onClick={() => setWednesdayMode(option.title)}
                            className={twMerge("rounded-3xl p-4 text-left transition hover:-translate-y-0.5", wednesdayMode === option.title ? "bg-reef text-white shadow-soft" : "bg-white/80 text-ink")}
                          >
                            <span className="text-sm font-bold">{option.title}</span>
                            <span className={twMerge("mt-2 block text-sm leading-6", wednesdayMode === option.title ? "text-white/80" : "text-ink/65")}>{option.plan}</span>
                            <span className={twMerge("mt-3 block text-xs font-bold", wednesdayMode === option.title ? "text-white/70" : "text-reef")}>{option.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-2 rounded-full bg-palm/10 px-4 py-2 text-sm font-bold text-palm"><ThumbsUp size={16} /> Vote up</button>
                    <button className="inline-flex items-center gap-2 rounded-full bg-hibiscus/10 px-4 py-2 text-sm font-bold text-hibiscus">Thumbs down</button>
                    <a href="#suggestions" className="inline-flex items-center gap-2 rounded-full bg-reef px-4 py-2 text-sm font-bold text-white"><Plus size={16} /> Suggest alternative</a>
                  </div>
                  <CommentBox itemId={day.id} comments={comments} />
                </motion.div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function MapSection() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const filtered = filter === "all" ? places : places.filter((place) => place.category === filter);
  const [surf, setSurf] = useState("Calm");
  const [wind, setWind] = useState("Light");
  const [tide, setTide] = useState("Mid");
  const safeToSnorkel = surf === "Calm" && wind !== "Strong";

  return (
    <section id="map" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Ocean check" title="Snorkeling + drive-time guide" text="Start with a simple conditions check, then scan route-friendly beaches, food, breweries, Made in Hawaii stops, golf, and resort anchors." />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <div className="overflow-hidden rounded-[24px]">
              <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Lanikai%20Beach.jpg?width=1200" alt="Tropical Oahu beach" className="h-80 w-full object-cover" />
            </div>
            <div>
              <Badge className={safeToSnorkel ? "bg-palm/10 text-palm" : "bg-hibiscus/10 text-hibiscus"}>
                {safeToSnorkel ? "Best today: Ko Olina Lagoons" : "Use caution today"}
              </Badge>
              <h3 className="mt-4 text-3xl font-bold text-ink">Snorkeling conditions check</h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                Best family-friendly default: Ko Olina Lagoons. Best adventure option only when calm: Shark&apos;s Cove. If surf, wind, visibility, or lifeguard guidance feels off, make it a beach walk instead.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Surf
                  <select className="mt-2 w-full rounded-2xl border border-reef/10 bg-white px-3 py-3 text-sm normal-case tracking-normal text-ink outline-none" value={surf} onChange={(event) => setSurf(event.target.value)}>
                    {["Calm", "Moderate", "Rough"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Wind
                  <select className="mt-2 w-full rounded-2xl border border-reef/10 bg-white px-3 py-3 text-sm normal-case tracking-normal text-ink outline-none" value={wind} onChange={(event) => setWind(event.target.value)}>
                    {["Light", "Breezy", "Strong"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
                  Tide
                  <select className="mt-2 w-full rounded-2xl border border-reef/10 bg-white px-3 py-3 text-sm normal-case tracking-normal text-ink outline-none" value={tide} onChange={(event) => setTide(event.target.value)}>
                    {["Low", "Mid", "High"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-5 rounded-3xl bg-sand/70 p-4">
                <p className="text-sm font-bold text-ink">{safeToSnorkel ? "Plan: lagoon snorkel window" : "Plan: swim/walk only unless conditions improve"}</p>
                <p className="mt-1 text-sm leading-6 text-ink/65">
                  Check lifeguard signs, surf report, wind, and visibility before entering. For teens, pair short snorkel time with beach games so it stays fun and low-stress.
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {["all", "resort", "trail", "beach", "food", "shaved-ice", "farmers-market", "brewery", "distillery", "made-in-hawaii", "golf"].map((item) => (
              <button key={item} onClick={() => setFilter(item as Category | "all")} className={twMerge("rounded-full px-3 py-2 text-xs font-bold capitalize", filter === item ? "bg-reef text-white" : "bg-sand text-ink")}>
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
                  {place.tags.map((tag) => <span key={tag} className="rounded-full bg-lagoon/10 px-2 py-1 text-[11px] font-bold text-reef">{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

const islandBounds = {
  minLat: 21.25,
  maxLat: 21.72,
  minLng: -158.22,
  maxLng: -157.64
};

function projectPoint(lat: number, lng: number) {
  const x = ((lng - islandBounds.minLng) / (islandBounds.maxLng - islandBounds.minLng)) * 100;
  const y = (1 - (lat - islandBounds.minLat) / (islandBounds.maxLat - islandBounds.minLat)) * 100;
  return { x: Math.min(96, Math.max(4, x)), y: Math.min(94, Math.max(6, y)) };
}

function allMapPoints() {
  return [
    ...places.map((place) => ({ ...place, type: place.category, source: "place" })),
    ...farmerMarkets.map((market) => ({ ...market, type: "farmers-market" as const, source: "market" })),
    ...madeInHawaiiLocations.map((location) => ({ ...location, type: "made-in-hawaii" as const, source: "made-in-hawaii", address: location.address, driveFromResort: "Route-fit stop", tags: [location.category] })),
    ...golfCourses.map((course) => ({ ...course, type: "golf" as const, source: "golf", address: course.address, driveFromResort: course.driveFromKoOlina, tags: course.tags }))
  ];
}

type MapPoint = ReturnType<typeof allMapPoints>[number];

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

function GoogleRouteMap({
  activeType,
  nearbyPoints,
  route,
  routePoints
}: {
  activeType: string;
  nearbyPoints: MapPoint[];
  route: typeof routePlans[number];
  routePoints: Array<{ lat: number; lng: number; id: string; name: string; address?: string; type?: string; source?: string }>;
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

function RouteMapSection() {
  const [selectedDay, setSelectedDay] = useState(routePlans[0].dayId);
  const [activeType, setActiveType] = useState("all");
  const selectedRoute = routePlans.find((route) => route.dayId === selectedDay) ?? routePlans[0];
  const points = allMapPoints();
  const visibleStopIds = new Set(selectedRoute.stops);
  const selectedDayMeta = days.find((day) => day.id === selectedRoute.dayId);
  const routePoints = selectedRoute.stops.map(pointById).filter(Boolean) as Array<{ lat: number; lng: number; id: string; name: string; address?: string }>;
  const routeStartAddress = resort.address;
  const routeEndAddress = routePoints.length > 1 ? routePoints[routePoints.length - 1].address || routePoints[routePoints.length - 1].name : resort.address;
  const routeDirectionsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(routeStartAddress)}&destination=${encodeURIComponent(routeEndAddress)}`;
  const routeQuery = encodeURIComponent(routePoints.map((point) => point.name).filter(Boolean).join(" to ") || resort.name);
  const nearbyPoints = points
    .filter((point) => !visibleStopIds.has(point.id) && ["food", "brewery", "distillery", "farmers-market", "made-in-hawaii", "golf", "shaved-ice"].includes(point.type))
    .filter((point) => activeType === "all" || point.type === activeType)
    .slice(0, 10);

  function pointById(id: string) {
    return points.find((point) => point.id === id);
  }

  return (
    <section id="route-map" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Island routes" title="Daily route map" text="Choose Friday through Friday to show that day’s route, nearby eateries, golf, breweries, farmers markets, Made in Hawaii stops, and scenic pins." />
      <div className="mx-auto max-w-6xl">
        <Card className="mb-5 p-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {routePlans.map((route) => {
              const meta = days.find((day) => day.id === route.dayId);
              const label = meta?.date.split(",")[0] ?? route.label;
              return (
                <button
                  key={route.dayId}
                  onClick={() => setSelectedDay(route.dayId)}
                  className={twMerge("rounded-2xl px-3 py-3 text-left transition", selectedDay === route.dayId ? "text-white shadow-soft" : "bg-sand text-ink hover:bg-white")}
                  style={selectedDay === route.dayId ? { background: route.color } : undefined}
                >
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] opacity-75">{label}</span>
                  <span className="mt-1 block text-sm font-bold leading-tight">{route.label.replace(/^Day \d+\s*/, "")}</span>
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
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${selectedRoute.color}22`, color: selectedRoute.color }}>{selectedDayMeta?.date ?? selectedRoute.label}</span>
                <h3 className="mt-2 text-2xl font-bold text-ink">{selectedRoute.label} route</h3>
                <p className="mt-1 text-sm text-ink/65">{selectedRoute.totalDrive} · {selectedRoute.leaveBy}</p>
              </div>
              <a href={routeDirectionsUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-reef px-4 py-3 text-sm font-bold text-white">Open route</a>
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
          <GoogleRouteMap activeType={activeType} nearbyPoints={nearbyPoints} route={selectedRoute} routePoints={routePoints} />
          <div className="mt-4 flex flex-wrap gap-2">
            {["all", "beach", "trail", "food", "brewery", "distillery", "shaved-ice", "farmers-market", "made-in-hawaii", "golf", "resort", "scenic"].map((type) => (
              <button key={type} onClick={() => setActiveType(type)} className={twMerge("rounded-full px-3 py-2 text-xs font-bold capitalize", activeType === type ? "bg-reef text-white" : "bg-sand text-ink")}>
                {type.replace("-", " ")}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-3">
          <Card className="p-5">
            <h3 className="text-2xl font-bold text-ink">{selectedRoute.label} details</h3>
            <p className="mt-2 text-sm text-ink/65"><strong>Leave by:</strong> {selectedRoute.leaveBy}</p>
            <p className="mt-1 text-sm text-ink/65"><strong>Drive:</strong> {selectedRoute.totalDrive}</p>
            <p className="mt-1 text-sm leading-6 text-ink/65">{selectedRoute.trafficNote}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedRoute.parkingWarnings.map((warning) => <span key={warning} className="rounded-full bg-hibiscus/10 px-3 py-2 text-xs font-bold text-hibiscus">{warning}</span>)}
            </div>
            <div className="mt-5 grid gap-2">
              {routePoints.map((point, index) => (
                <a key={`${point.id}-${index}`} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${point.name} ${"address" in point ? point.address : ""}`)}`} target="_blank" rel="noreferrer" className="grid grid-cols-[28px_1fr] items-center gap-3 rounded-2xl bg-sand/70 px-3 py-3 text-sm font-bold text-ink">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: selectedRoute.color }}>{index + 1}</span>
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

function FoodSection() {
  const [query, setQuery] = useState("");
  const foodPlaces = places.filter((place) => place.category === "food" || place.category === "shaved-ice" || place.category === "brewery" || place.category === "farmers-market");
  const visibleFood = foodPlaces.filter((place) => `${place.name} ${place.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="food" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Food votes" title="Restaurants, treats, and market ideas" text="Keep breakfast simple at the resort, then use the board for lunches, dinners, coffee, shave ice, and local stops." />
      <div className="mx-auto mb-5 max-w-3xl rounded-3xl bg-white/80 p-3 shadow-soft">
        <label className="flex items-center gap-3 rounded-2xl bg-sand/70 px-4 py-3 text-ink/70">
          <Search size={18} />
          <input className="w-full bg-transparent outline-none" placeholder="Search poke, coffee, shrimp trucks, breweries..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {foodCategories.map((category, index) => (
          <Card key={category} className="p-5">
            <div className="mb-4 inline-flex rounded-2xl bg-sunrise/20 p-3 text-hibiscus">
              {index % 3 === 0 ? <Coffee /> : index % 3 === 1 ? <Utensils /> : <Waves />}
            </div>
            <h3 className="text-xl font-bold text-ink">{category}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">Add recommendations, links, cost notes, and whether it works for a relaxed family pace.</p>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-5 grid max-w-6xl gap-3 md:grid-cols-3">
        {visibleFood.slice(0, 6).map((place) => (
          <Card key={place.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-ink">{place.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{place.tags.join(" · ")}</p>
              </div>
              <button className="rounded-full bg-sunrise/20 px-3 py-1 text-xs font-bold text-hibiscus">Save</button>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sunrise">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FarmersMarketsSection() {
  const [query, setQuery] = useState("");
  const [day, setDay] = useState("All");
  const [selectedId, setSelectedId] = useState(farmerMarkets[0]?.id ?? "");
  const dayOptions = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const visibleMarkets = farmerMarkets.filter((market) => {
    const matchesDay = day === "All" || market.days.includes(day);
    const searchable = `${market.name} ${market.location} ${market.address} ${market.region} ${market.recommendedStop}`.toLowerCase();
    return matchesDay && searchable.includes(query.toLowerCase());
  });
  const selected = farmerMarkets.find((market) => market.id === selectedId) ?? visibleMarkets[0] ?? farmerMarkets[0];
  const alignedMarkets = farmerMarkets.filter((market) => market.bestItineraryDays.some((match) => ["Saturday", "Sunday", "Monday", "Wednesday", "Thursday", "Friday"].includes(match))).slice(0, 6);

  async function addMarketToItinerary(marketName: string) {
    await addSuggestion({
      author: "Family planner",
      title: `Add ${marketName} to the itinerary`,
      category: "farmers-market",
      notes: "Suggested from the farmers market database as a route-friendly stop."
    });
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  return (
    <section id="farmers-markets" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Local produce + treats" title="Farmers markets database" text="Search every recurring market from the Oʻahu weekly schedule, filter by day, and add route-friendly stops directly into the family planning board." />
      <div className="mx-auto mb-5 grid max-w-6xl gap-3 md:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-3xl bg-white/85 px-4 py-3 shadow-soft text-ink/70">
          <Search size={18} />
          <input className="w-full bg-transparent outline-none" placeholder="Search markets, regions, addresses, route notes..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select className="rounded-3xl border border-reef/10 bg-white/85 px-4 py-3 font-bold text-ink shadow-soft outline-none" value={day} onChange={(event) => setDay(event.target.value)}>
          {dayOptions.map((option) => <option key={option}>{option}</option>)}
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
            <p className="mt-1 text-sm text-ink/65">{selected.days.join(", ")} · {selected.hours}</p>
            <p className="mt-1 text-sm text-ink/65">{selected.address}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{selected.region}</Badge>
              <Badge>{selected.driveFromResort}</Badge>
              {selected.bestItineraryDays.map((match) => <Badge key={match} className="bg-palm/10 text-palm">Best: {match}</Badge>)}
            </div>
            <button onClick={() => addMarketToItinerary(selected.name)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-reef px-4 py-3 font-bold text-white">
              <Plus size={18} /> Add market to itinerary
            </button>
          </div>
        </Card>

        <div className="flex max-h-[640px] flex-col gap-3 overflow-auto pr-1 soft-scroll">
          {visibleMarkets.map((market) => (
            <Card key={market.id} className={twMerge("cursor-pointer p-4 transition hover:-translate-y-0.5", selected.id === market.id && "ring-2 ring-reef")} >
              <button onClick={() => setSelectedId(market.id)} className="block w-full text-left">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{market.name}</h3>
                    <p className="mt-1 text-sm text-ink/65">{market.days.join(", ")} · {market.hours}</p>
                    <p className="mt-1 text-xs text-ink/55">{market.location} · {market.region}</p>
                  </div>
                  <Badge className="shrink-0">{market.driveFromResort}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/65">{market.recommendedStop}</p>
                <div className="mt-3 grid gap-1 text-xs text-ink/60">
                  <p><strong className="text-ink">Nearby beach:</strong> {market.nearby.beaches.join(", ")}</p>
                  <p><strong className="text-ink">Nearby trail:</strong> {market.nearby.trails.join(", ")}</p>
                  <p><strong className="text-ink">Nearby food:</strong> {market.nearby.food.join(", ")}</p>
                </div>
                {market.parkingWarning && <p className="mt-2 rounded-2xl bg-hibiscus/10 px-3 py-2 text-xs font-bold text-hibiscus">{market.parkingWarning}</p>}
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
              <button onClick={() => addMarketToItinerary(market.name)} className="mt-3 rounded-full bg-sand px-4 py-2 text-sm font-bold text-ink">Add suggestion</button>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-6xl">
        <Card className="p-5">
          <h3 className="text-xl font-bold text-ink">Other source-listed ad-hoc markets</h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">These appear on the source page as ad-hoc markets, so the site lists them for future planning but does not assign recurring hours or route pins until a specific event date is chosen.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {adHocFarmersMarkets.map((market) => (
              <span key={market} className="rounded-full bg-sand px-3 py-2 text-xs font-bold text-ink">{market}</span>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function MadeInHawaiiSection() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(madeInHawaiiLocations[0]?.id ?? "");
  const categories = ["all", "coffee", "macadamia", "cacao", "brewery", "distillery", "pineapple", "food-production", "shave-ice", "poke", "shrimp"];
  const visible = madeInHawaiiLocations.filter((location) => filter === "all" || location.category === filter);
  const selected = madeInHawaiiLocations.find((location) => location.id === selectedId) ?? visible[0] ?? madeInHawaiiLocations[0];

  return (
    <section id="made-in-hawaii" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Authentic local experiences" title="Made in Hawaii" text="Production-forward stops: coffee, cacao, pineapple, macadamia nuts, local breweries/distilleries, poke, shrimp trucks, and shave ice." />
      <div className="mx-auto mb-5 flex max-w-6xl gap-2 overflow-x-auto pb-2 soft-scroll">
        {categories.map((category) => (
          <button key={category} onClick={() => setFilter(category)} className={twMerge("whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold capitalize", filter === category ? "bg-reef text-white" : "bg-white/80 text-ink")}>
            {category.replace("-", " ")}
          </button>
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((location) => (
            <Card key={location.id} className={twMerge("overflow-hidden transition hover:-translate-y-1", selected.id === location.id && "ring-2 ring-reef")}>
              <button onClick={() => setSelectedId(location.id)} className="w-full text-left">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {location.photoGallery.slice(0, 2).map((photo) => <img key={photo} src={photo} alt="" className="h-28 w-full rounded-2xl object-cover" />)}
                </div>
                <div className="p-5 pt-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{location.category.replace("-", " ")}</Badge>
                    {location.onsiteProduction && <Badge className="bg-palm/10 text-palm">Onsite production</Badge>}
                    {location.familyFriendly && <Badge>Family friendly</Badge>}
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-ink">{location.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{location.notes}</p>
                  <div className="mt-3 grid gap-1 text-xs text-ink/60">
                    <p><strong className="text-ink">Tasting:</strong> {location.tasting}</p>
                    <p><strong className="text-ink">Duration:</strong> {location.duration}</p>
                    <p><strong className="text-ink">Scenic value:</strong> {location.scenicValue}/5</p>
                    <p><strong className="text-ink">Fits:</strong> {location.itineraryCompatibility.join(", ")}</p>
                  </div>
                </div>
              </button>
            </Card>
          ))}
        </div>
        <Card className="overflow-hidden p-3">
          <iframe title="Made in Hawaii map" className="h-[410px] w-full rounded-[24px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(selected.mapQuery)}&output=embed`} />
          <div className="p-4">
            <h3 className="text-2xl font-bold text-ink">{selected.name}</h3>
            <p className="mt-1 text-sm text-ink/65">{selected.address}</p>
            <p className="mt-3 text-sm leading-6 text-ink/70">{selected.notes}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.mapQuery)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-2xl bg-reef px-4 py-3 font-bold text-white">Open map</a>
          </div>
        </Card>
      </div>
    </section>
  );
}

function GolfSection() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(golfCourses[0]?.id ?? "");
  const filters = ["all", "Near Ko Olina", "Ocean Views", "Jungle Course", "Beginner Friendly", "Practice Facilities", "Rental Clubs", "More Affordable", "Resort Luxury", "Mountain Views"];
  const visible = golfCourses.filter((course) => {
    const matchesFilter = filter === "all" || course.tags.includes(filter) || course.recommendationLabels.includes(filter);
    const haystack = `${course.name} ${course.tags.join(" ")} ${course.recommendationLabels.join(" ")} ${course.notes}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  });
  const selected = golfCourses.find((course) => course.id === selectedId) ?? visible[0] ?? golfCourses[0];
  const premium = golfCourses.filter((course) => !course.tags.includes("More Affordable"));
  const casual = golfCourses.filter((course) => course.tags.includes("More Affordable"));

  return (
    <section id="golf" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Scenic tee times" title="Golf on Oahu" text="Approachable vacation golf focused on Ko Olina convenience, scenery, transparent rate notes, family fit, and realistic drive times." />
      <div className="mx-auto mb-5 grid max-w-6xl gap-3 md:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-3xl bg-white/85 px-4 py-3 shadow-soft text-ink/70">
          <Search size={18} />
          <input className="w-full bg-transparent outline-none" placeholder="Search ocean views, jungle, rentals, twilight, beginner..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select className="rounded-3xl border border-reef/10 bg-white/85 px-4 py-3 font-bold text-ink shadow-soft outline-none" value={filter} onChange={(event) => setFilter(event.target.value)}>
          {filters.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_1fr]">
        <Card className="overflow-hidden p-3">
          <iframe title="Golf course map" className="h-[390px] w-full rounded-[24px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(`${selected.name} ${selected.address}`)}&output=embed`} />
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {selected.recommendationLabels.map((label) => <Badge key={label} className={label === "Most Convenient Option" ? "bg-sunrise/20 text-hibiscus" : ""}>{label}</Badge>)}
            </div>
            <h3 className="mt-3 text-3xl font-bold text-ink">{selected.name}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">{selected.notes}</p>
            <div className="mt-4 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
              <p><strong className="text-ink">18 holes:</strong> {selected.price18}</p>
              <p><strong className="text-ink">9 holes:</strong> {selected.price9 ?? "Check course"}</p>
              <p><strong className="text-ink">Twilight:</strong> {selected.twilight ?? "Check course"}</p>
              <p><strong className="text-ink">Drive:</strong> {selected.driveFromKoOlina}</p>
              <p><strong className="text-ink">Rentals:</strong> {selected.rentalClubs}</p>
              <p><strong className="text-ink">Range:</strong> {selected.drivingRange}</p>
              <p><strong className="text-ink">Best tee time:</strong> {selected.bestTeeTime}</p>
              <p><strong className="text-ink">Weather:</strong> {selected.weatherWindNote}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Scenic {selected.scenicRating}/5</Badge>
              <Badge>Beginner {selected.beginnerRating}/5</Badge>
              <Badge>Family {selected.familyRating}/5</Badge>
              <Badge>{selected.access}</Badge>
            </div>
            <a href={selected.website} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-2xl bg-reef px-4 py-3 font-bold text-white">Book/check current rates</a>
          </div>
        </Card>
        <div className="flex max-h-[760px] flex-col gap-3 overflow-auto pr-1 soft-scroll">
          {visible.map((course) => (
            <Card key={course.id} className={twMerge("cursor-pointer p-4 transition hover:-translate-y-0.5", selected.id === course.id && "ring-2 ring-reef")}>
              <button onClick={() => setSelectedId(course.id)} className="block w-full text-left">
                <div className="flex gap-3">
                  <img src={course.photo} alt="" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-bold text-ink">{course.name}</h3>
                    <p className="mt-1 text-sm text-ink/65">{course.driveFromKoOlina} from Ko Olina · {course.difficulty}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{course.price18}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {course.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-sand px-2 py-1 text-[11px] font-bold text-ink">{tag}</span>)}
                    </div>
                  </div>
                </div>
              </button>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-2xl font-bold text-ink">Premium scenic picks</h3>
          <div className="mt-4 grid gap-2">
            {premium.slice(0, 6).map((course) => <div key={course.id} className="rounded-2xl bg-sand/70 p-3 text-sm font-bold text-ink">{course.name} · {course.recommendationLabels[0]}</div>)}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-2xl font-bold text-ink">More affordable / casual options</h3>
          <div className="mt-4 grid gap-2">
            {casual.map((course) => <div key={course.id} className="rounded-2xl bg-sand/70 p-3 text-sm font-bold text-ink">{course.name} · {course.driveFromKoOlina}</div>)}
          </div>
        </Card>
      </div>
    </section>
  );
}

function BeachExplorer() {
  return (
    <section id="beaches" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Beach scout" title="Beach explorer" text="Visual cards for family fit, parking stress, amenities, swimming notes, and sunset potential." />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
        {beaches.map((beach) => (
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
      </div>
    </section>
  );
}

function TrailsExplorer() {
  return (
    <section id="trails" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="No-stress adventure" title="Trail explorer" text="Teen-friendly, short, scenic trail candidates with mud, stream, permit, parking, food, and beach pairing notes." />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
        {trails.map((trail) => (
          <Card key={trail.id} className="overflow-hidden">
            <div className="grid sm:grid-cols-[190px_1fr]">
              <img src={trail.image} alt="" className="h-full min-h-56 w-full object-cover" />
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={trail.permit === "Permit required" ? "bg-hibiscus/10 text-hibiscus" : "bg-palm/10 text-palm"}>{trail.permit}</Badge>
                  <Badge>{trail.difficulty}</Badge>
                  <Badge>{trail.distance}</Badge>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-ink">{trail.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{trail.notes}</p>
                <div className="mt-4 grid gap-2 text-sm text-ink/70">
                  <p><strong className="text-ink">Time:</strong> {trail.time}</p>
                  <p><strong className="text-ink">Mud:</strong> {trail.mud} · <strong className="text-ink">Streams:</strong> {trail.streams}</p>
                  <p><strong className="text-ink">Crowd/Parking:</strong> {trail.crowd} / {trail.parking}</p>
                  <p><strong className="text-ink">Nearby food:</strong> {trail.nearbyFood}</p>
                  <p><strong className="text-ink">Beach pairing:</strong> {trail.beachPairing}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ChecklistAndBudget() {
  const [checked, setChecked] = useState<string[]>([]);
  const [groceries, setGroceries] = useState(["Water bottles", "Breakfast fruit", "Granola bars", "Sandwich supplies", "Reef-safe sunscreen"]);
  const [newGrocery, setNewGrocery] = useState("");
  const [expenses, setExpenses] = useState([
    { item: "Costco arrival stock-up", cost: 250 },
    { item: "North Shore lunch + shave ice", cost: 180 },
    { item: "Sunset dinner", cost: 320 }
  ]);
  const total = expenses.reduce((sum, item) => sum + item.cost, 0);

  return (
    <section id="tools" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Travel tools" title="Packing checklist + budget tracker" text="Small practical helpers for the family before and during the trip." />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-palm/10 p-3 text-palm"><Check /></div>
            <h3 className="text-2xl font-bold text-ink">Packing checklist</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {packingItems.map((item) => {
              const isChecked = checked.includes(item);
              return (
                <button key={item} onClick={() => setChecked(isChecked ? checked.filter((entry) => entry !== item) : [...checked, item])} className={twMerge("flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold transition", isChecked ? "bg-palm text-white" : "bg-sand text-ink hover:bg-white")}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-palm">{isChecked && <Check size={16} />}</span>
                  {item}
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-hibiscus/10 p-3 text-hibiscus"><BadgeDollarSign /></div>
            <h3 className="text-2xl font-bold text-ink">Shared estimate</h3>
          </div>
          <div className="grid gap-3">
            {expenses.map((expense, index) => (
              <div key={expense.item} className="grid grid-cols-[1fr_110px] gap-2">
                <input value={expense.item} onChange={(event) => setExpenses(expenses.map((entry, itemIndex) => itemIndex === index ? { ...entry, item: event.target.value } : entry))} className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none" />
                <input type="number" value={expense.cost} onChange={(event) => setExpenses(expenses.map((entry, itemIndex) => itemIndex === index ? { ...entry, cost: Number(event.target.value) } : entry))} className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none" />
              </div>
            ))}
            <button onClick={() => setExpenses([...expenses, { item: "New idea", cost: 0 }])} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sand px-4 py-3 font-bold text-ink">
              <Plus size={18} /> Add expense
            </button>
          </div>
          <div className="mt-5 rounded-3xl bg-reef p-5 text-white">
            <p className="text-sm font-semibold text-white/70">Current shared estimate</p>
            <p className="text-4xl font-bold">${total.toLocaleString()}</p>
          </div>
        </Card>
      </div>
      <div className="mx-auto mt-5 grid max-w-6xl gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-lagoon/10 p-3 text-reef"><Plus /></div>
            <h3 className="text-2xl font-bold text-ink">Collaborative grocery list</h3>
          </div>
          <form className="flex gap-2" onSubmit={(event) => {
            event.preventDefault();
            if (!newGrocery.trim()) return;
            setGroceries([...groceries, newGrocery.trim()]);
            setNewGrocery("");
          }}>
            <input className="min-w-0 flex-1 rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none" placeholder="Add Costco or room item" value={newGrocery} onChange={(event) => setNewGrocery(event.target.value)} />
            <button className="rounded-2xl bg-reef px-4 py-3 font-bold text-white">Add</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {groceries.map((item) => <span key={item} className="rounded-full bg-sand px-4 py-2 text-sm font-bold text-ink">{item}</span>)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-sunrise/20 p-3 text-hibiscus"><Bell /></div>
            <h3 className="text-2xl font-bold text-ink">Trip timing helpers</h3>
          </div>
          <div className="grid gap-3 text-sm text-ink/70">
            <p><strong className="text-ink">Sunrise:</strong> around 5:50 AM · <strong className="text-ink">Sunset:</strong> around 7:05 PM in late May.</p>
            <p><strong className="text-ink">Best time to leave:</strong> use early starts for windward/North Shore days and avoid crossing Honolulu near late afternoon commute.</p>
            <p><strong className="text-ink">Mobile notifications:</strong> planned as a Firebase Cloud Messaging upgrade once the family deployment is live.</p>
          </div>
        </Card>
      </div>
    </section>
  );
}

function AdminPanel() {
  const [draftDays, setDraftDays] = useState(days.map((day) => day.title));

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draftDays.length) return;
    const next = [...draftDays];
    [next[index], next[target]] = [next[target], next[index]];
    setDraftDays(next);
  }

  return (
    <section id="admin" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Editable framework" title="Planning admin panel" text="A lightweight editing surface for preliminary planning, future rearranging, and turning this into a reusable trip framework." />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <h3 className="text-2xl font-bold text-ink">Editable modules</h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">The trip data is centralized, so dates, meals, trails, beaches, and tags can be updated later without redesigning the site.</p>
          <div className="mt-4 grid gap-2">
            {["Itinerary cards", "Food explorer", "Beach explorer", "Trail database", "Suggestions board", "Memory wall"].map((item) => (
              <div key={item} className="rounded-2xl bg-sand/70 px-4 py-3 font-bold text-ink">{item}</div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-2xl font-bold text-ink">Drag-and-drop style ordering</h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">Use the arrows now; this is structured so a full drag-and-drop library can replace these controls later.</p>
          <div className="mt-4 grid gap-2">
            {draftDays.map((title, index) => (
              <div key={`${title}-${index}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
                <span className="font-bold text-ink">{title}</span>
                <button className="rounded-full bg-sand px-3 py-1 font-bold text-ink" onClick={() => move(index, -1)}>Up</button>
                <button className="rounded-full bg-sand px-3 py-1 font-bold text-ink" onClick={() => move(index, 1)}>Down</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function MemoryWall({ suggestions }: { suggestions: Suggestion[] }) {
  const memories = suggestions.filter((suggestion) => suggestion.category === "memory" || suggestion.imageUrl);
  return (
    <section id="memories" className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="During the trip" title="Optional memory wall" text="Add photos, links, favorite meals, and little moments so the planner becomes the family scrapbook." />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <SuggestionForm compact />
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {memories.map((memory) => (
            <Card key={memory.id} className="overflow-hidden">
              {memory.imageUrl ? <img src={memory.imageUrl} alt="" className="h-48 w-full object-cover" /> : <div className="flex h-48 items-center justify-center bg-lagoon/10 text-reef"><Camera size={42} /></div>}
              <div className="p-5">
                <Badge>{memory.author}</Badge>
                <h3 className="mt-3 text-xl font-bold text-ink">{memory.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{memory.notes}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [comments, setComments] = useState<TripComment[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    let unsubscribeSuggestions = subscribeSuggestions(setSuggestions);
    let unsubscribeComments = subscribeComments(setComments);
    const refresh = () => {
      unsubscribeSuggestions();
      unsubscribeComments();
      unsubscribeSuggestions = subscribeSuggestions(setSuggestions);
      unsubscribeComments = subscribeComments(setComments);
    };
    window.addEventListener("oahu-data-refresh", refresh);
    return () => {
      window.removeEventListener("oahu-data-refresh", refresh);
      unsubscribeSuggestions();
      unsubscribeComments();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const quickDays = useMemo(() => days.map((day) => ({ id: day.id, label: day.date.split(",")[0], title: day.title })), []);

  return (
    <main className="min-h-screen overflow-hidden">
      <section id="home" className="relative min-h-[92vh] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 ocean-mask">
          <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%20Disneys%20Aulani%20resort%20and%20Ko%20Olina%20Lagoon.jpg?width=1800" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-reef/20 to-sand" />
        </div>
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white/78 px-4 py-3 shadow-soft backdrop-blur-xl">
          <a href="#home" className="flex items-center gap-2 font-bold text-ink"><Palmtree className="text-palm" /> Oahu Family Planner</a>
          <div className="hidden items-center gap-1 md:flex">
            {["itinerary", "suggestions", "map", "route-map", "food", "made-in-hawaii", "golf", "farmers-markets", "beaches", "trails", "tools", "admin", "memories"].map((item) => (
              <a key={item} href={`#${item}`} className="rounded-full px-3 py-2 text-sm font-bold capitalize text-ink/70 hover:bg-sand hover:text-ink">{item}</a>
            ))}
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sand text-ink" aria-label="Toggle dark mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        <div className="mx-auto grid max-w-7xl items-end gap-8 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-white/85 text-reef">May 22-29 · Ko Olina home base</Badge>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-tight text-white drop-shadow-lg sm:text-7xl">
              Oahu Family Vacation
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
              A shared planning hub for early beach mornings, easy hikes, food votes, drive times, comments, and favorite vacation memories.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#itinerary" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-reef shadow-float transition hover:-translate-y-0.5"><CalendarDays size={18} /> View itinerary</a>
              <a href="#suggestions" className="inline-flex items-center gap-2 rounded-full bg-ink/70 px-6 py-3 font-bold text-white shadow-float backdrop-blur transition hover:-translate-y-0.5"><MessageCircle size={18} /> Add suggestion</a>
            </div>
          </motion.div>

          <div className="grid gap-4">
            <Countdown />
            <WeatherWidget />
            <FeaturedActivities />
            <Card className="glass p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-palm/15 p-3 text-palm"><MapPin /></div>
                <div>
                  <p className="text-sm font-bold text-ink/60">Resort</p>
                  <h2 className="text-2xl font-bold text-ink">{resort.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{resort.address}</p>
                  <p className="mt-2 text-sm font-bold text-reef">{resort.note}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-hibiscus">
            <Navigation size={16} /> Quick day links
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickDays.map((day) => (
              <a key={day.id} href="#itinerary" className="rounded-3xl bg-white/80 p-4 shadow-soft transition hover:-translate-y-1 hover:bg-white">
                <p className="font-bold text-reef">{day.label}</p>
                <p className="mt-1 text-sm text-ink/65">{day.title}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Itinerary comments={comments} />

      <section id="suggestions" className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Family board" title="Suggestions, votes, and comments" text="Restaurants, beaches, trails, links, optional photos, and family reactions all live here." />
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-hibiscus/10 p-3 text-hibiscus"><Sparkles /></div>
              <h3 className="text-2xl font-bold text-ink">Add an idea</h3>
            </div>
            <SuggestionForm />
          </Card>
          <SuggestionsBoard suggestions={suggestions} />
        </div>
      </section>

      <MapSection />
      <RouteMapSection />
      <FoodSection />
      <MadeInHawaiiSection />
      <GolfSection />
      <FarmersMarketsSection />
      <BeachExplorer />
      <TrailsExplorer />
      <ChecklistAndBudget />
      <AdminPanel />
      <MemoryWall suggestions={suggestions} />

      <footer className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[28px] bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Ready for Ko Olina.</p>
            <p className="mt-1 text-sm text-white/65">Early mornings, flexible afternoons, and a shared place for every good idea.</p>
          </div>
          <div className="flex gap-2 text-sunrise">
            <Sun /><Waves /><TentTree /><Heart /><Star />
          </div>
        </div>
      </footer>
    </main>
  );
}
