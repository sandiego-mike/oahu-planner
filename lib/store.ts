"use client";

import { getSupabase } from "@/lib/supabase";
import { sampleComments, sampleSuggestions } from "@/lib/trip-data";
import type { Memory, SavedPlace, Suggestion, TripComment } from "@/lib/types";

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
    familyRating: row.family_rating,
    photoUrl: row.photo_url,
    mapsUrl: row.maps_url,
    website: row.website,
    placeType: row.place_type,
    userNote: row.user_note,
    addedBy: row.added_by,
    createdAt: row.created_at
  };
}

function mapMemoryRow(row: any): Memory {
  return {
    id: row.id,
    dayId: row.day_id,
    author: row.author,
    photoUrl: row.photo_url,
    caption: row.caption,
    createdAt: row.created_at
  };
}

export function subscribeMemories(callback: (memories: Memory[]) => void) {
  const db = getSupabase();
  if (!db) { callback([]); return () => undefined; }

  const fetchAll = () =>
    db.from("memories").select("*").order("created_at", { ascending: false })
      .then(({ data }) => callback(data?.length ? data.map(mapMemoryRow) : []));

  fetchAll();
  const channel = db.channel("memories-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "memories" }, fetchAll)
    .subscribe();
  return () => { db.removeChannel(channel); };
}

export async function addMemory(memory: Omit<Memory, "id" | "createdAt">) {
  const db = getSupabase();
  if (!db) return;
  await db.from("memories").insert({
    day_id: memory.dayId,
    author: memory.author,
    photo_url: memory.photoUrl,
    caption: memory.caption ?? null
  });
}

export async function deleteMemory(id: string) {
  const db = getSupabase();
  if (!db) return;
  await db.from("memories").delete().eq("id", id);
}

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX = 1920;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.85);
    };
    img.src = objectUrl;
  });
}

export async function uploadMemoryPhoto(file: File): Promise<string | null> {
  const db = getSupabase();
  if (!db) return null;
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const compressed = await compressImage(file);
  const { error } = await db.storage.from("memories").upload(fileName, compressed, {
    contentType: "image/jpeg"
  });
  if (error) { console.error("Upload error:", error); return null; }
  return db.storage.from("memories").getPublicUrl(fileName).data.publicUrl;
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

export async function savePlace(place: Omit<SavedPlace, "id" | "createdAt">): Promise<string | null> {
  const db = getSupabase();
  if (!db) return "No database connection";
  const { error } = await db.from("saved_places").insert({
    food_category: place.foodCategory,
    name: place.name,
    address: place.address ?? null,
    family_rating: place.familyRating ?? null,
    photo_url: place.photoUrl ?? null,
    maps_url: place.mapsUrl ?? null,
    website: place.website ?? null,
    place_type: place.placeType ?? null,
    user_note: place.userNote ?? null,
    added_by: place.addedBy
  });
  if (error) { console.error("savePlace:", error); return error.message; }
  return null;
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
