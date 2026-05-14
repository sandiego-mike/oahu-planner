"use client";

import { useEffect, useState } from "react";
import { voteSuggestion } from "@/lib/store";
import type { Suggestion } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const reactions = ["👍", "❤️", "🌊", "🍧", "📸"];

export function SuggestionsBoard({ suggestions: incoming }: { suggestions: Suggestion[] }) {
  const [local, setLocal] = useState<Suggestion[]>(incoming);
  useEffect(() => { setLocal(incoming); }, [incoming]);

  function handleVote(suggestion: Suggestion, emoji: string) {
    setLocal((prev) =>
      prev.map((s) =>
        s.id === suggestion.id
          ? { ...s, votes: { ...s.votes, [emoji]: (s.votes[emoji] ?? 0) + 1 } }
          : s
      )
    );
    voteSuggestion(suggestion, emoji).then(() =>
      window.dispatchEvent(new Event("oahu-data-refresh"))
    );
  }

  if (local.length === 0) {
    return <p className="py-10 text-center text-ink/50">No suggestions yet — be the first!</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {local.map((s) => (
        <Card key={s.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <Badge>{s.category}</Badge>
            <span className="text-xs font-semibold text-ink/45">{s.author}</span>
          </div>
          <h3 className="mt-4 text-xl font-bold text-ink">{s.title}</h3>
          <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{s.notes}</p>
          {s.link && (
            <a
              className="mt-3 inline-flex text-sm font-bold text-reef underline-offset-4 hover:underline"
              href={s.link}
              target="_blank"
              rel="noreferrer"
            >
              Open link
            </a>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {reactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleVote(s, emoji)}
                className="rounded-full bg-sand px-3 py-1.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 active:scale-95"
              >
                {emoji} {s.votes[emoji] ?? 0}
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
