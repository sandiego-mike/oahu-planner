"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addComment, deleteComment } from "@/lib/store";
import type { Interest, TripComment } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

const reactions = ["👍", "❤️", "🌊", "🍧", "📸"];

function CommentItem({ comment, onDeleted }: { comment: TripComment; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");

  async function handleDelete() {
    if (nameInput.trim().toLowerCase() !== comment.author.trim().toLowerCase()) {
      setError("Name doesn't match.");
      return;
    }
    await deleteComment(comment.id);
    onDeleted();
  }

  return (
    <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 font-bold text-ink">
          <span>{comment.reaction}</span>
          <span>{comment.author}</span>
          <Badge className="bg-white text-palm">{comment.interest}</Badge>
        </div>
        {!confirming && (
          <button
            onClick={() => setConfirming(true)}
            aria-label="Delete comment"
            className="rounded-full p-1.5 text-ink/30 transition hover:bg-hibiscus/10 hover:text-hibiscus"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <p className="mt-1 text-ink/70">{comment.text}</p>
      {confirming && (
        <div className="mt-3 rounded-2xl border border-hibiscus/20 bg-hibiscus/5 p-3">
          <p className="text-xs font-bold text-hibiscus mb-2">Enter your name to delete this comment</p>
          <div className="flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-xl border border-reef/10 bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-hibiscus/30"
              placeholder={comment.author}
              value={nameInput}
              onChange={(e) => { setNameInput(e.target.value); setError(""); }}
            />
            <button
              onClick={handleDelete}
              className="rounded-xl bg-hibiscus px-3 py-1.5 text-xs font-bold text-white"
            >
              Delete
            </button>
            <button
              onClick={() => { setConfirming(false); setNameInput(""); setError(""); }}
              className="rounded-xl bg-sand px-3 py-1.5 text-xs font-bold text-ink"
            >
              Cancel
            </button>
          </div>
          {error && <p className="mt-1.5 text-xs text-hibiscus">{error}</p>}
        </div>
      )}
    </div>
  );
}

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

  function handleDeleted() {
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
          <CommentItem key={c.id} comment={c} onDeleted={handleDeleted} />
        ))}
      </div>
    </div>
  );
}
