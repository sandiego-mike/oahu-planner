"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { addSuggestion } from "@/lib/store";
import type { Category } from "@/lib/types";
import { twMerge } from "tailwind-merge";

const categories = [
  { label: "General", value: "general" },
  { label: "Restaurant", value: "food" },
  { label: "Beach", value: "beach" },
  { label: "Trail", value: "trail" },
  { label: "Shaved ice", value: "shaved-ice" },
  { label: "Brewery", value: "brewery" },
  { label: "Memory", value: "memory" }
] as const;

export function SuggestionForm({ compact = false }: { compact?: boolean }) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "general" | "memory">("general");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!author.trim() || !title.trim()) return;
    await addSuggestion({ author, title, category, notes, link, imageUrl });
    setTitle("");
    setNotes("");
    setLink("");
    setImageUrl("");
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  return (
    <form onSubmit={handleSubmit} className={twMerge("grid gap-3", compact ? "" : "md:grid-cols-2")}>
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Idea title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40"
        value={category}
        onChange={(e) => setCategory(e.target.value as Category | "general" | "memory")}
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <input
        className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40"
        placeholder="Optional link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      {!compact && (
        <input
          className="rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40 md:col-span-2"
          placeholder="Optional photo URL for memory wall"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      )}
      <textarea
        className="min-h-24 rounded-2xl border border-reef/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-lagoon/40 md:col-span-2"
        placeholder="Notes, parking tips, why it sounds fun..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-reef px-5 py-3 font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink md:col-span-2">
        <Send size={18} /> Submit idea
      </button>
    </form>
  );
}
