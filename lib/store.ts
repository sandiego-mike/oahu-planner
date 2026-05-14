"use client";

import { getSupabase } from "@/lib/supabase";
import { sampleComments, sampleSuggestions } from "@/lib/trip-data";
import type { SavedPlace, Suggestion, TripComment } from "@/lib/types";

const suggestionKey = "oahu-family-suggestions";
const commentKey = "oahu-family-comments";

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : fallback;
}

function writeLocal<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function mapSuggestionRow(row: any): Suggestion {
  return {
    id: row.id,
    author: row.author,
    title: row.title,
    category: row.category,
    notes: row.notes,
    link: row.link,
    imageUrl: row.image_url,
    votes: row.votes ?? {},
    createdAt: row.created_at
  };
}

function mapCommentRow(row: any): TripComment {
  return {
    id: row.id,
    itemId: row.item_id,
    author: row.author,
    text: row.text,
    reaction: row.reaction,
    interest: row.interest,
    createdAt: row.created_at
  };
}

export function subscribeSuggestions(callback: (suggestions: Suggestion[]) => void) {
  const db = getSupabase();
  if (!db) {
    callback(readLocal(suggestionKey, sampleSuggestions));
    return () => undefined;
  }

  const fetchAll = () =>
    db
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (typeof window !== "undefined") window.localStorage.removeItem(suggestionKey);
        callback(data?.length ? data.map(mapSuggestionRow) : []);
      });

  fetchAll();

  const channel = db
    .channel("suggestions-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "suggestions" }, fetchAll)
    .subscribe();

  return () => { db.removeChannel(channel); };
}

export function subscribeComments(callback: (comments: TripComment[]) => void) {
  const db = getSupabase();
  if (!db) {
    callback(readLocal(commentKey, sampleComments));
    return () => undefined;
  }

  const fetchAll = () =>
    db
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (typeof window !== "undefined") window.localStorage.removeItem(commentKey);
        callback(data?.length ? data.map(mapCommentRow) : []);
      });

  fetchAll();

  const channel = db
    .channel("comments-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, fetchAll)
    .subscribe();

  return () => { db.removeChannel(channel); };
}

export async function addSuggestion(suggestion: Omit<Suggestion, "id" | "votes" | "createdAt">) {
  const db = getSupabase();
  if (db) {
    await db.from("suggestions").insert({
      author: suggestion.author,
      title: suggestion.title,
      category: suggestion.category,
      notes: suggestion.notes,
      link: suggestion.link ?? null,
      image_url: suggestion.imageUrl ?? null,
      votes: {}
    });
    return;
  }

  const current = readLocal(suggestionKey, sampleSuggestions);
  writeLocal(suggestionKey, [
    { ...suggestion, id: crypto.randomUUID(), votes: {}, createdAt: new Date().toISOString() },
    ...current
  ]);
}

export async function addComment(comment: Omit<TripComment, "id" | "createdAt">) {
  const db = getSupabase();
  if (db) {
    await db.from("comments").insert({
      item_id: comment.itemId,
      author: comment.author,
      text: comment.text,
      reaction: comment.reaction ?? null,
      interest: comment.interest ?? null
    });
    return;
  }

  const current = readLocal(commentKey, sampleComments);
  writeLocal(commentKey, [
    { ...comment, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ...current
  ]);
}

function mapSavedPlaceRow(row: any): SavedPlace {
  return {
    id: row.id,
    foodCategory: row.food_category,
    name: row.name,
    address: row.address,
    rating: row.rating,
    reviewCount: row.review_count,
    photoRef: row.photo_ref,
    mapsUrl: row.maps_url,
    website: row.website,
    userNote: row.user_note,
    addedBy: row.added_by,
    createdAt: row.created_at
  };
}

export function subscribeSavedPlaces(callback: (places: SavedPlace[]) => void) {
  const db = getSupabase();
  if (!db) {
    callback([]);
    return () => undefined;
  }

  const fetchAll = () =>
    db
      .from("saved_places")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => callback(data?.length ? data.map(mapSavedPlaceRow) : []));

  fetchAll();

  const channel = db
    .channel("saved-places-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "saved_places" }, fetchAll)
    .subscribe();

  return () => { db.removeChannel(channel); };
}

export async function savePlace(place: Omit<SavedPlace, "id" | "createdAt">) {
  const db = getSupabase();
  if (!db) return;
  await db.from("saved_places").insert({
    food_category: place.foodCategory,
    name: place.name,
    address: place.address ?? null,
    rating: place.rating ?? null,
    review_count: place.reviewCount ?? null,
    photo_ref: place.photoRef ?? null,
    maps_url: place.mapsUrl ?? null,
    website: place.website ?? null,
    user_note: place.userNote ?? null,
    added_by: place.addedBy
  });
}

export async function deletePlace(id: string) {
  const db = getSupabase();
  if (!db) return;
  await db.from("saved_places").delete().eq("id", id);
}

export async function updatePlaceNote(id: string, note: string) {
  const db = getSupabase();
  if (!db) return;
  await db.from("saved_places").update({ user_note: note }).eq("id", id);
}

export async function deleteComment(id: string) {
  const db = getSupabase();
  if (db) {
    await db.from("comments").delete().eq("id", id);
    return;
  }

  const current = readLocal(commentKey, sampleComments);
  writeLocal(commentKey, current.filter((c) => c.id !== id));
}

export async function voteSuggestion(suggestion: Suggestion, emoji: string) {
  const votes = { ...suggestion.votes, [emoji]: (suggestion.votes[emoji] ?? 0) + 1 };
  const db = getSupabase();
  if (db) {
    await db.from("suggestions").update({ votes }).eq("id", suggestion.id);
    return;
  }

  const current = readLocal(suggestionKey, sampleSuggestions);
  writeLocal(
    suggestionKey,
    current.map((item) => (item.id === suggestion.id ? { ...item, votes } : item))
  );
}
