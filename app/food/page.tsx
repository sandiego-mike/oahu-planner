"use client";

import { useState } from "react";
import {
  Coffee,
  ExternalLink,
  Heart,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Star,
  Sun,
  TentTree,
  Trash2,
  Utensils,
  Waves,
  X
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { deletePlace, updatePlaceNote } from "@/lib/store";
import { useData } from "@/components/DataProvider";
import { PlaceSearchModal } from "@/components/PlaceSearchModal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SavedPlace } from "@/lib/types";

type FoodCat = {
  id: string;
  label: string;
  icon: React.ReactNode;
  searchHint: string;
  description: string;
};

const FOOD_CATS: FoodCat[] = [
  { id: "shaved-ice", label: "Shaved Ice", icon: "🍧", searchHint: "shaved ice", description: "Ululani's, Matsumoto, Island Snow" },
  { id: "coffee-breakfast", label: "Coffee & Breakfast", icon: <Coffee size={20} />, searchHint: "coffee breakfast cafe", description: "Morning fuel before beach or trail" },
  { id: "poke", label: "Poke", icon: "🐟", searchHint: "poke bowl", description: "Fresh ahi, salmon, and local bowls" },
  { id: "shrimp-trucks", label: "Shrimp Trucks", icon: "🦐", searchHint: "shrimp truck", description: "North Shore garlic shrimp plates" },
  { id: "lunch-dinner", label: "Lunch & Dinner", icon: <Utensils size={20} />, searchHint: "restaurant lunch dinner", description: "Sit-down and casual family meals" },
  { id: "local-hawaiian", label: "Local Hawaiian", icon: "🌺", searchHint: "local Hawaiian food plate lunch", description: "Plate lunches and island classics" },
  { id: "breweries", label: "Breweries & Distilleries", icon: "🍺", searchHint: "brewery distillery craft beer", description: "Craft beer and local spirits" },
  { id: "desserts", label: "Desserts & Treats", icon: "🍰", searchHint: "dessert bakery treats", description: "Ice cream, mochi, malasadas" },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? "text-sunrise fill-sunrise" : "text-ink/15"}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-ink">{rating.toFixed(1)}</span>
    </span>
  );
}

function PlaceCard({ place }: { place: SavedPlace }) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(place.userNote ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSaveNote() {
    setSaving(true);
    await updatePlaceNote(place.id, note);
    setSaving(false);
    setEditing(false);
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  async function handleDelete() {
    if (!confirm(`Remove "${place.name}" from the list?`)) return;
    await deletePlace(place.id);
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  const mapsUrl = place.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " Oahu")}`;

  return (
    <Card className="overflow-hidden">
      {place.photoRef && (
        <img
          src={`/api/places/photo?ref=${place.photoRef}`}
          alt=""
          className="h-36 w-full object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-ink leading-tight">{place.name}</h4>
            {place.rating && (
              <div className="mt-1">
                <StarRow rating={place.rating} />
                {place.reviewCount && (
                  <span className="text-xs text-ink/40"> ({place.reviewCount.toLocaleString()} reviews)</span>
                )}
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button onClick={() => setEditing(!editing)} className="rounded-full p-1.5 text-ink/30 hover:bg-sand hover:text-reef" aria-label="Edit note">
              <Pencil size={13} />
            </button>
            <button onClick={handleDelete} className="rounded-full p-1.5 text-ink/30 hover:bg-hibiscus/10 hover:text-hibiscus" aria-label="Remove place">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {place.address && (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-ink/55 leading-4">
            <MapPin size={11} className="mt-0.5 shrink-0 text-reef" />
            {place.address}
          </p>
        )}

        {editing ? (
          <div className="mt-3 grid gap-2">
            <textarea
              className="min-h-16 w-full rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
              placeholder="Add a note, best dish, tip…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="rounded-xl bg-sand px-3 py-1.5 text-xs font-bold text-ink">Cancel</button>
              <button onClick={handleSaveNote} disabled={saving} className="rounded-xl bg-reef px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50">Save</button>
            </div>
          </div>
        ) : (
          place.userNote && (
            <p className="mt-2 rounded-xl bg-sand/70 px-3 py-2 text-xs leading-5 text-ink/70">{place.userNote}</p>
          )
        )}

        {place.addedBy && (
          <p className="mt-2 text-xs text-ink/35">Added by {place.addedBy}</p>
        )}

        <div className="mt-3 flex gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-reef px-3 py-2 text-xs font-bold text-white"
          >
            <Navigation size={12} /> Directions
          </a>
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-sand px-3 py-2 text-xs font-bold text-ink"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function CategorySection({ cat, places }: { cat: FoodCat; places: SavedPlace[] }) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const catPlaces = places.filter((p) => p.foodCategory === cat.id);

  return (
    <div>
      {/* Category header card — same pill/card style as current design */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={twMerge(
          "w-full rounded-[28px] bg-white/85 shadow-soft ring-1 ring-white/70 p-5 text-left transition hover:-translate-y-0.5",
          expanded && "ring-2 ring-reef/30"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sunrise/20 p-3 text-hibiscus text-xl">
              {typeof cat.icon === "string" ? cat.icon : cat.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink">{cat.label}</h3>
              <p className="mt-0.5 text-sm text-ink/55">{cat.description}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {catPlaces.length > 0 && (
              <Badge className="bg-reef/10 text-reef">{catPlaces.length} saved</Badge>
            )}
            <div className={twMerge("text-reef transition", expanded && "rotate-180")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 px-1">
          {catPlaces.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-3">
              {catPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <p className="mb-3 rounded-2xl bg-sand/50 px-4 py-4 text-sm text-center text-ink/50">
              No places saved yet — search and add your first pick.
            </p>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-reef/30 px-5 py-3 text-sm font-bold text-reef transition hover:border-reef hover:bg-reef/5"
          >
            <Plus size={16} /> Add Place
          </button>
        </div>
      )}

      {modalOpen && (
        <PlaceSearchModal
          categoryId={cat.id}
          categoryLabel={cat.label}
          searchHint={cat.searchHint}
          onClose={() => setModalOpen(false)}
          onAdded={() => window.dispatchEvent(new Event("oahu-data-refresh"))}
        />
      )}
    </div>
  );
}

export default function FoodPage() {
  const { savedPlaces } = useData();

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Family food guide"
          title="Restaurants, treats, and market ideas"
          text="Search real Oahu places, save your picks by category, and get directions instantly during the trip."
        />

        <div className="mx-auto max-w-4xl grid gap-3">
          {FOOD_CATS.map((cat) => (
            <CategorySection key={cat.id} cat={cat} places={savedPlaces} />
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
