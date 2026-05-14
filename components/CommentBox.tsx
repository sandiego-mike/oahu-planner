"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { addComment } from "@/lib/store";
import type { Interest, TripComment } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

const reactions = ["👍", "❤️", "🌊", "🍧", "📸"];

export function CommentBox({ itemId, comments }: { itemId: string; comments: TripComment[] }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [reaction, setReaction] = useState("👍");
  const [interest, setInterest] = useState<Interest>("interested");
  const dayComments = comments.filter((c) => c.itemId === itemId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    await addComment({ itemId, author, text, reaction, interest });
    setText("");
    window.dispatchEvent(new Event("oahu-data-refresh"));
  }

  return (
    <div className="mt-5 rounded-3xl bg-sand/70 p-4">
      <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-[1fr_1.5fr_auto_auto_auto]">
        <input
          className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
          placeholder="Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lagoon/40"
          placeholder="Comment or suggestion"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none"
          value={reaction}
          onChange={(e) => setReaction(e.target.value)}
        >
          {reactions.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select
          className="rounded-2xl border border-reef/10 bg-white px-3 py-2 text-sm outline-none"
          value={interest}
          onChange={(e) => setInterest(e.target.value as Interest)}
        >
          <option value="maybe">Maybe</option>
          <option value="interested">Interested</option>
          <option value="must-do">Must-do</option>
        </select>
        <button
          aria-label="Add comment"
          className="inline-flex items-center justify-center rounded-2xl bg-reef px-4 py-2 text-white transition hover:bg-ink"
        >
          <Plus size={18} />
        </button>
      </form>
      <div className="mt-4 grid gap-2">
        {dayComments.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white/80 px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2 font-bold text-ink">
              <span>{c.reaction}</span>
              <span>{c.author}</span>
              <Badge className="bg-white text-palm">{c.interest}</Badge>
            </div>
            <p className="mt-1 text-ink/70">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
