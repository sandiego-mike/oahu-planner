"use client";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
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

export function subscribeSuggestions(callback: (suggestions: Suggestion[]) => void) {
  const db = getFirebaseDb();
  if (!db) {
    callback(readLocal(suggestionKey, sampleSuggestions));
    return () => undefined;
  }

  return onSnapshot(query(collection(db, "suggestions"), orderBy("createdAt", "desc")), (snapshot) => {
    const items = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })) as Suggestion[];
    callback(items.length ? items : sampleSuggestions);
  });
}

export function subscribeComments(callback: (comments: TripComment[]) => void) {
  const db = getFirebaseDb();
  if (!db) {
    callback(readLocal(commentKey, sampleComments));
    return () => undefined;
  }

  return onSnapshot(query(collection(db, "comments"), orderBy("createdAt", "desc")), (snapshot) => {
    const items = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })) as TripComment[];
    callback(items.length ? items : sampleComments);
  });
}

export async function addSuggestion(suggestion: Omit<Suggestion, "id" | "votes" | "createdAt">) {
  const db = getFirebaseDb();
  if (db) {
    await addDoc(collection(db, "suggestions"), {
      ...suggestion,
      votes: {},
      createdAt: serverTimestamp()
    });
    return;
  }

  const current = readLocal(suggestionKey, sampleSuggestions);
  writeLocal(suggestionKey, [
    {
      ...suggestion,
      id: crypto.randomUUID(),
      votes: {},
      createdAt: new Date().toISOString()
    },
    ...current
  ]);
}

export async function addComment(comment: Omit<TripComment, "id" | "createdAt">) {
  const db = getFirebaseDb();
  if (db) {
    await addDoc(collection(db, "comments"), {
      ...comment,
      createdAt: serverTimestamp()
    });
    return;
  }

  const current = readLocal(commentKey, sampleComments);
  writeLocal(commentKey, [
    {
      ...comment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    },
    ...current
  ]);
}

export async function voteSuggestion(suggestion: Suggestion, emoji: string) {
  const votes = {
    ...suggestion.votes,
    [emoji]: (suggestion.votes[emoji] ?? 0) + 1
  };
  const db = getFirebaseDb();
  if (db) {
    await updateDoc(doc(db, "suggestions", suggestion.id), { votes });
    return;
  }

  const current = readLocal(suggestionKey, sampleSuggestions);
  writeLocal(
    suggestionKey,
    current.map((item) => (item.id === suggestion.id ? { ...item, votes } : item))
  );
}
