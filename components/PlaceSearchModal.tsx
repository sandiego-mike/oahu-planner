"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  PencilLine,
  Search,
  Star,
  X
} from "lucide-react";
import { savePlace } from "@/lib/store";

type OsmResult = {
  id: number;
  osmType: string;
  name: string;
  address: string | null;
  placeType: string;
  cuisine: string | null;
  website: string | null;
  phone: string | null;
  lat: number | null;
  lon: number | null;
  mapsUrl: string;
};

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition"
        >
          <Star
            size={22}
            className={(hover || value) >= n ? "fill-sunrise text-sunrise" : "text-ink/20"}
          />
        </button>
      ))}
      {value > 0 && <span className="ml-1 text-sm font-bold text-ink">{value}/5</span>}
    </div>
  );
}

function AddForm({
  prefill,
  categoryId,
  categoryLabel,
  onClose,
  onAdded
}: {
  prefill: Partial<OsmResult>;
  categoryId: string;
  categoryLabel: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [addedBy, setAddedBy] = useState("");
  const [familyRating, setFamilyRating] = useState(0);
  const [photoUrl, setPhotoUrl] = useState("");
  const [userNote, setUserNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!addedBy.trim()) return;
    setSaving(true);
    setSaveError("");
    const err = await savePlace({
      foodCategory: categoryId,
      name: prefill.name ?? "",
      address: prefill.address ?? null,
      familyRating: familyRating || null,
      photoUrl: photoUrl.trim() || null,
      mapsUrl: prefill.mapsUrl ?? null,
      website: prefill.website ?? null,
      placeType: prefill.placeType ?? null,
      userNote: userNote.trim() || null,
      addedBy: addedBy.trim()
    });
    setSaving(false);
    if (err) { setSaveError(err); return; }
    onAdded();
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 p-4">
      {/* Place summary */}
      <div className="rounded-2xl bg-sand/60 p-3">
        <p className="font-bold text-ink">{prefill.name}</p>
        {prefill.address && (
          <p className="mt-1 flex items-start gap-1.5 text-xs text-ink/55">
            <MapPin size={11} className="mt-0.5 shrink-0 text-reef" />
            {prefill.address}
          </p>
        )}
        {prefill.cuisine && (
          <p className="mt-1 text-xs text-ink/50 capitalize">{prefill.cuisine}</p>
        )}
        <div className="mt-2 flex gap-2">
          <a
            href={prefill.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-lagoon/10 px-3 py-1 text-xs font-bold text-reef"
          >
            <Navigation size={11} /> Directions
          </a>
          {prefill.website && (
            <a
              href={prefill.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs font-bold text-ink"
            >
              <ExternalLink size={11} /> Website
            </a>
          )}
        </div>
      </div>

      {/* Your name */}
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Your name (required)"
        value={addedBy}
        onChange={(e) => setAddedBy(e.target.value)}
        required
      />

      {/* Family rating */}
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
          Your rating
        </p>
        <StarPicker value={familyRating} onChange={setFamilyRating} />
      </div>

      {/* Note */}
      <textarea
        className="min-h-16 rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Why you recommend it, best dish, tip, etc."
        value={userNote}
        onChange={(e) => setUserNote(e.target.value)}
      />

      {/* Optional photo URL */}
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Optional photo URL (paste any image link)"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
      />

      {saveError && (
        <p className="rounded-2xl bg-hibiscus/10 px-3 py-2 text-xs text-hibiscus">
          Save failed: {saveError}. Make sure the saved_places table exists in Supabase.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-sand px-4 py-2.5 text-sm font-bold text-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!addedBy.trim() || saving}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-reef px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : null}
          Add to {categoryLabel}
        </button>
      </div>
    </form>
  );
}

function ManualEntryForm({
  categoryId,
  categoryLabel,
  onClose,
  onAdded
}: {
  categoryId: string;
  categoryLabel: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [familyRating, setFamilyRating] = useState(0);
  const [photoUrl, setPhotoUrl] = useState("");
  const [userNote, setUserNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !addedBy.trim()) return;
    setSaving(true);
    setSaveError("");
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address + " Oahu Hawaii")}`;
    const err = await savePlace({
      foodCategory: categoryId,
      name: name.trim(),
      address: address.trim() || null,
      familyRating: familyRating || null,
      photoUrl: photoUrl.trim() || null,
      mapsUrl,
      website: website.trim() || null,
      placeType: null,
      userNote: userNote.trim() || null,
      addedBy: addedBy.trim()
    });
    setSaving(false);
    if (err) { setSaveError(err); return; }
    onAdded();
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 p-4">
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Place name (required)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Address or area (optional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Website (optional)"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Your name (required)"
        value={addedBy}
        onChange={(e) => setAddedBy(e.target.value)}
        required
      />
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Your rating</p>
        <StarPicker value={familyRating} onChange={setFamilyRating} />
      </div>
      <textarea
        className="min-h-16 rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Why you recommend it, best dish, tip, etc."
        value={userNote}
        onChange={(e) => setUserNote(e.target.value)}
      />
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Optional photo URL"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
      />
      {saveError && (
        <p className="rounded-2xl bg-hibiscus/10 px-3 py-2 text-xs text-hibiscus">
          Save failed: {saveError}. Make sure the saved_places table exists in Supabase.
        </p>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-2xl bg-sand px-4 py-2.5 text-sm font-bold text-ink">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim() || !addedBy.trim() || saving}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-reef px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : null}
          Add to {categoryLabel}
        </button>
      </div>
    </form>
  );
}

export function PlaceSearchModal({
  categoryId,
  categoryLabel,
  searchHint,
  onClose,
  onAdded
}: {
  categoryId: string;
  categoryLabel: string;
  searchHint: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [tab, setTab] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OsmResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OsmResult | null>(null);
  const [error, setError] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoading(true);
      setSelected(null);
      setError("");
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}&hint=${encodeURIComponent(searchHint)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setError("Search failed — check connection.");
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [query, searchHint]);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center p-4">
      <div className="w-full max-w-xl rounded-[28px] bg-white shadow-float overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-reef/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-hibiscus">
              Add to {categoryLabel}
            </p>
            <h3 className="text-xl font-bold text-ink">Find a place</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-ink/40 hover:bg-sand hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-reef/10 px-4 pt-3 gap-1">
          <button
            onClick={() => { setTab("search"); setSelected(null); }}
            className={`rounded-t-xl px-4 py-2 text-sm font-bold transition ${tab === "search" ? "bg-reef text-white" : "text-ink/50 hover:text-ink"}`}
          >
            <span className="flex items-center gap-1.5"><Search size={14} /> Search OSM</span>
          </button>
          <button
            onClick={() => { setTab("manual"); setSelected(null); }}
            className={`rounded-t-xl px-4 py-2 text-sm font-bold transition ${tab === "manual" ? "bg-reef text-white" : "text-ink/50 hover:text-ink"}`}
          >
            <span className="flex items-center gap-1.5"><PencilLine size={14} /> Add manually</span>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {tab === "manual" ? (
            <ManualEntryForm
              categoryId={categoryId}
              categoryLabel={categoryLabel}
              onClose={onClose}
              onAdded={onAdded}
            />
          ) : selected ? (
            <AddForm
              prefill={selected}
              categoryId={categoryId}
              categoryLabel={categoryLabel}
              onClose={onClose}
              onAdded={onAdded}
            />
          ) : (
            <>
              {/* Search input */}
              <div className="p-4 pb-2">
                <label className="flex items-center gap-3 rounded-2xl border border-reef/10 bg-sand/70 px-4 py-3">
                  {loading
                    ? <Loader2 size={18} className="animate-spin text-reef" />
                    : <Search size={18} className="text-ink/50" />}
                  <input
                    ref={inputRef}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
                    placeholder={`Search ${categoryLabel.toLowerCase()}… e.g. "Giovanni's"`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                {error && <p className="mt-2 text-xs text-hibiscus">{error}</p>}
                <p className="mt-2 text-xs text-ink/40">
                  Powered by OpenStreetMap — no account or API key needed.
                </p>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="px-4 pb-4 grid gap-2">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="w-full rounded-2xl bg-sand/60 px-4 py-3 text-left transition hover:bg-white hover:shadow-soft"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-ink text-sm">{r.name}</p>
                        <span className="shrink-0 rounded-full bg-lagoon/10 px-2 py-0.5 text-[11px] font-bold capitalize text-reef">
                          {r.placeType.replace("_", " ")}
                        </span>
                      </div>
                      {r.cuisine && (
                        <p className="mt-0.5 text-xs capitalize text-ink/50">{r.cuisine}</p>
                      )}
                      {r.address && (
                        <p className="mt-1 flex items-start gap-1.5 text-xs text-ink/55">
                          <MapPin size={11} className="mt-0.5 shrink-0 text-reef" />
                          {r.address}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && !error && (
                <div className="px-4 pb-6 text-center">
                  <p className="text-sm text-ink/50">Not found in OpenStreetMap.</p>
                  <button
                    onClick={() => setTab("manual")}
                    className="mt-2 text-sm font-bold text-reef underline-offset-4 hover:underline"
                  >
                    Add it manually instead →
                  </button>
                </div>
              )}

              {!query && (
                <p className="px-4 pb-6 text-center text-sm text-ink/40">
                  Try &quot;Matsumoto&quot;, &quot;Giovanni&apos;s&quot;, or &quot;Ululani&quot;
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
