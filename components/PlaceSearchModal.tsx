"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2, MapPin, Navigation, Search, Star, X } from "lucide-react";
import { savePlace } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";

type SearchResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: { photo_reference: string }[];
};

type PlaceDetail = SearchResult & {
  website?: string;
  url?: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= Math.round(rating) ? "text-sunrise fill-sunrise" : "text-ink/20"}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-ink">{rating.toFixed(1)}</span>
    </span>
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PlaceDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [addedBy, setAddedBy] = useState("");
  const [userNote, setUserNote] = useState("");
  const [saving, setSaving] = useState(false);
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
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}&hint=${encodeURIComponent(searchHint)}`);
        const data = await res.json();
        if (data.error) { setError(data.error); setResults([]); }
        else { setResults(data.results?.slice(0, 8) ?? []); setError(""); }
      } catch {
        setError("Search failed. Check your connection.");
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query, searchHint]);

  async function selectPlace(result: SearchResult) {
    setDetailLoading(true);
    setSelected(null);
    try {
      const res = await fetch(`/api/places/details?placeId=${result.place_id}`);
      const data = await res.json();
      if (data.result) {
        setSelected({ ...data.result, place_id: result.place_id });
      }
    } catch {
      setSelected(result as PlaceDetail);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleAdd() {
    if (!selected || !addedBy.trim()) return;
    setSaving(true);
    await savePlace({
      foodCategory: categoryId,
      name: selected.name,
      address: selected.formatted_address ?? null,
      rating: selected.rating ?? null,
      reviewCount: selected.user_ratings_total ?? null,
      photoRef: selected.photos?.[0]?.photo_reference ?? null,
      mapsUrl: selected.url ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.name + " Oahu Hawaii")}`,
      website: selected.website ?? null,
      userNote: userNote.trim() || null,
      addedBy: addedBy.trim()
    });
    setSaving(false);
    onAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center p-4">
      <div className="w-full max-w-xl rounded-[28px] bg-white shadow-float overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-reef/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-hibiscus">Add to {categoryLabel}</p>
            <h3 className="text-xl font-bold text-ink">Search Oahu places</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-ink/40 hover:bg-sand hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {/* Search input */}
          <div className="p-4">
            <label className="flex items-center gap-3 rounded-2xl border border-reef/10 bg-sand/70 px-4 py-3">
              {loading ? <Loader2 size={18} className="animate-spin text-reef" /> : <Search size={18} className="text-ink/50" />}
              <input
                ref={inputRef}
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
                placeholder={`Search ${categoryLabel.toLowerCase()} on Oahu…`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {error && <p className="mt-2 text-xs text-hibiscus">{error}</p>}
          </div>

          {/* Detail view */}
          {detailLoading && (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-reef" />
            </div>
          )}

          {selected && !detailLoading && (
            <div className="px-4 pb-4">
              <div className="rounded-3xl border border-reef/10 bg-sand/40 overflow-hidden">
                {selected.photos?.[0] && (
                  <img
                    src={`/api/places/photo?ref=${selected.photos[0].photo_reference}`}
                    alt=""
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="text-xl font-bold text-ink">{selected.name}</h4>
                  {selected.rating && <div className="mt-1"><Stars rating={selected.rating} /> <span className="text-xs text-ink/50 ml-1">({selected.user_ratings_total?.toLocaleString()} reviews)</span></div>}
                  <div className="mt-2 flex items-start gap-1.5 text-sm text-ink/65">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-reef" />
                    {selected.formatted_address}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {selected.url && (
                      <a href={selected.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-lagoon/10 px-3 py-1.5 text-xs font-bold text-reef">
                        <Navigation size={12} /> Directions
                      </a>
                    )}
                    {selected.website && (
                      <a href={selected.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-xs font-bold text-ink">
                        <ExternalLink size={12} /> Website
                      </a>
                    )}
                  </div>

                  {/* Add form */}
                  <div className="mt-4 grid gap-2">
                    <input
                      className="rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
                      placeholder="Your name (required)"
                      value={addedBy}
                      onChange={(e) => setAddedBy(e.target.value)}
                    />
                    <textarea
                      className="min-h-16 rounded-2xl border border-reef/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
                      placeholder="Optional note: best dish, tip, must-try item…"
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(null)}
                        className="rounded-2xl bg-sand px-4 py-2.5 text-sm font-bold text-ink"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAdd}
                        disabled={!addedBy.trim() || saving}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-reef px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                        Add to {categoryLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search results */}
          {!selected && !detailLoading && results.length > 0 && (
            <div className="px-4 pb-4 grid gap-2">
              {results.map((r) => (
                <button
                  key={r.place_id}
                  onClick={() => selectPlace(r)}
                  className="w-full rounded-2xl bg-sand/60 px-4 py-3 text-left transition hover:bg-white hover:shadow-soft"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-ink text-sm">{r.name}</p>
                    {r.rating && <Stars rating={r.rating} />}
                  </div>
                  <p className="mt-1 text-xs text-ink/55 line-clamp-1">{r.formatted_address}</p>
                  {r.user_ratings_total && (
                    <p className="mt-0.5 text-xs text-ink/40">{r.user_ratings_total.toLocaleString()} reviews</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!selected && !loading && !detailLoading && query.trim() && results.length === 0 && !error && (
            <p className="px-4 pb-6 text-center text-sm text-ink/50">No results found — try a different search.</p>
          )}

          {!query && !selected && (
            <p className="px-4 pb-6 text-center text-sm text-ink/40">
              Type a name like &quot;Giovanni&apos;s&quot;, &quot;Matsumoto&quot;, or &quot;Island Snow&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
