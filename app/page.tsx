"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CloudSun,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Star,
  Sun,
  TentTree,
  Utensils,
  Waves,
  Leaf,
  CircleDot
} from "lucide-react";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { days, resort, tripStart } from "@/lib/trip-data";
import { useData } from "@/components/DataProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function Countdown() {
  const start = new Date(tripStart);
  const daysAway = differenceInDays(start, new Date());
  const label =
    daysAway > 0
      ? `${daysAway} days to go`
      : `Trip started ${formatDistanceToNowStrict(start)} ago`;

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

const WX_CODE_LABEL: Record<number, string> = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  80: "Rain showers", 81: "Showers", 82: "Heavy showers",
  95: "Thunderstorm", 96: "Thunderstorm + hail", 99: "Thunderstorm + hail"
};

function wxLabel(code: number): string {
  return WX_CODE_LABEL[code] ?? "Partly cloudy";
}

function wxIsRainy(code: number): boolean {
  return code >= 51 && code <= 99;
}

function WeatherWidget() {
  const [wx, setWx] = useState<{ temp: number; feels: number; label: string; wind: number; code: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=21.334&longitude=-158.127" +
      "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m" +
      "&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=Pacific%2FHonolulu"
    )
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        setWx({
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          label: wxLabel(c.weather_code),
          wind: Math.round(c.wind_speed_10m),
          code: c.weather_code
        });
      })
      .catch(() => { /* keep loading=true, shows fallback */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="glass p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-lagoon/15 p-3 text-reef">
          <CloudSun size={22} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink/60">Ko Olina — live weather</p>
          {loading ? (
            <p className="text-2xl font-bold text-ink/40">Loading…</p>
          ) : wx ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-2xl font-bold text-ink">{wx.temp}°F</p>
              <p className="text-sm text-ink/60">{wx.label}</p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-ink">Warm, 76–86°F</p>
          )}
        </div>
      </div>
      {wx && !loading && (
        <div className="mt-3 flex gap-4 text-xs text-ink/55 font-medium">
          <span>Feels like {wx.feels}°F</span>
          <span>Wind {wx.wind} mph</span>
          {wxIsRainy(wx.code) && <span className="text-hibiscus font-bold">☔ Rain possible</span>}
        </div>
      )}
      <p className="mt-2 text-xs leading-5 text-ink/50">
        Pack water, hats & reef-safe sunscreen. Check surf and rain each morning.
      </p>
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
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % featured.length),
      3200
    );
    return () => window.clearInterval(timer);
  }, [featured.length]);

  const item = featured[index];
  return (
    <Card className="glass p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-hibiscus/15 p-3 text-hibiscus">{item.icon}</div>
        <div>
          <p className="text-sm font-semibold text-ink/60">Featured activity</p>
          <motion.p
            key={item.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-ink"
          >
            {item.title}
          </motion.p>
          <p className="text-sm text-ink/65">{item.detail}</p>
        </div>
      </div>
    </Card>
  );
}

const navCards = [
  {
    href: "/itinerary",
    icon: <CalendarDays size={22} />,
    label: "Itinerary",
    desc: "Day-by-day activities and family comments"
  },
  {
    href: "/map",
    icon: <MapPin size={22} />,
    label: "Map",
    desc: "Interactive Oahu route map with day-by-day pins"
  },
  {
    href: "/beaches",
    icon: <Waves size={22} />,
    label: "Beaches",
    desc: "Beach explorer with parking and swimming ratings"
  },
  {
    href: "/trails",
    icon: <TentTree size={22} />,
    label: "Trails",
    desc: "Short teen-friendly trails, no permit required"
  },
  {
    href: "/food",
    icon: <Utensils size={22} />,
    label: "Food + Shaved Ice",
    desc: "Restaurants, poke, coffee, shaved ice, food trucks"
  },
  {
    href: "/farmers-markets",
    icon: <Leaf size={22} />,
    label: "Farmers Markets",
    desc: "All Oahu weekly markets with hours and map pins"
  },
  {
    href: "/made-in-hawaii",
    icon: <Star size={22} />,
    label: "Made in Hawaii",
    desc: "Coffee farms, chocolate, macadamia, and local production"
  },
  {
    href: "/golf",
    icon: <CircleDot size={22} />,
    label: "Golf",
    desc: "Oahu golf courses with pricing and distance from Ko Olina"
  },
  {
    href: "/suggestions",
    icon: <MessageCircle size={22} />,
    label: "Suggestions",
    desc: "Add ideas, vote, comment, and plan together"
  }
];

export default function Home() {
  const { suggestions } = useData();
  const quickDays = useMemo(
    () => days.map((day) => ({ id: day.id, label: day.date.split(",")[0], title: day.title })),
    []
  );

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero section */}
      <section className="relative min-h-[88vh] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 ocean-mask">
          <img
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%20Disneys%20Aulani%20resort%20and%20Ko%20Olina%20Lagoon.jpg?width=1800"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-reef/20 to-sand" />
        </div>

        <div className="mx-auto grid max-w-7xl items-end gap-8 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-white/85 text-reef">May 22-29 · Ko Olina home base</Badge>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-tight text-white drop-shadow-lg sm:text-7xl">
              Oahu Family Adventure
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
              A shared planning hub for early beach mornings, easy hikes, food votes, drive times, comments, and favorite vacation memories.
            </p>
            <p className="mt-2 text-base font-semibold text-white/75">
              Staying at {resort.name} · {resort.checkIn}–{resort.checkOut}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/itinerary"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-reef shadow-float transition hover:-translate-y-0.5"
              >
                <CalendarDays size={18} /> View itinerary
              </Link>
              <Link
                href="/suggestions"
                className="inline-flex items-center gap-2 rounded-full bg-ink/70 px-6 py-3 font-bold text-white shadow-float backdrop-blur transition hover:-translate-y-0.5"
              >
                <MessageCircle size={18} /> Add suggestion
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4">
            <Countdown />
            <WeatherWidget />
            <FeaturedActivities />
            <Card className="glass p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-palm/15 p-3 text-palm">
                  <MapPin />
                </div>
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

      {/* Quick day links */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-hibiscus">
            <Navigation size={16} /> Quick day links
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickDays.map((day) => (
              <Link
                key={day.id}
                href="/itinerary"
                className="rounded-3xl bg-white/80 p-4 shadow-soft transition hover:-translate-y-1 hover:bg-white"
              >
                <p className="font-bold text-reef">{day.label}</p>
                <p className="mt-1 text-sm text-ink/65">{day.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation cards grid */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-hibiscus">Explore</p>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">All trip sections</h2>
            <p className="mt-3 text-base leading-7 text-ink/70">Everything you need for a great family week in Oahu.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {navCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-[28px] bg-white/85 p-6 shadow-soft ring-1 ring-white/70 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-lagoon/10 p-3 text-reef transition group-hover:bg-reef group-hover:text-white">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-ink">{card.label}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{card.desc}</p>
              </Link>
            ))}
          </div>
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
