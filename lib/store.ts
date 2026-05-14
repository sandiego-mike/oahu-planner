"use client";

import { getSupabase } from "@/lib/supabase";
import { sampleComments, sampleSuggestions } from "@/lib/trip-data";
import type { Suggestion, TripComment } from "@/lib/types";

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
        callback(data?.length ? data.map(mapSuggestionRow) : sampleSuggestions);
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
        callback(data?.length ? data.map(mapCommentRow) : sampleComments);
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
