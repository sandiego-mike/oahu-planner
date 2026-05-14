"use client";

import { Camera, Heart, Sparkles, Star, Sun, TentTree, Waves } from "lucide-react";
import { useData } from "@/components/DataProvider";
import { SuggestionForm } from "@/components/SuggestionForm";
import { SuggestionsBoard } from "@/components/SuggestionsBoard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

function MemoryWall() {
  const { suggestions } = useData();
  const memories = suggestions.filter((s) => s.category === "memory" || s.imageUrl);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="During the trip"
        title="Optional memory wall"
        text="Add photos, links, favorite meals, and little moments so the planner becomes the family scrapbook."
      />
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <SuggestionForm compact />
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {memories.map((memory) => (
            <Card key={memory.id} className="overflow-hidden">
              {memory.imageUrl ? (
                <img src={memory.imageUrl} alt="" className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center bg-lagoon/10 text-reef">
                  <Camera size={42} />
                </div>
              )}
              <div className="p-5">
                <Badge>{memory.author}</Badge>
                <h3 className="mt-3 text-xl font-bold text-ink">{memory.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{memory.notes}</p>
              </div>
            </Card>
          ))}
          {memories.length === 0 && (
            <p className="col-span-full py-10 text-center text-ink/50">
              No memories yet — add the first one using the form!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function SuggestionsPage() {
  const { suggestions } = useData();
  // Exclude day-specific suggestions (those live inside the itinerary page)
  const generalSuggestions = suggestions.filter((s) => !s.link?.startsWith("__day:"));

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Family board"
          title="Suggestions, votes, and comments"
          text="Restaurants, beaches, trails, links, optional photos, and family reactions all live here."
        />
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-hibiscus/10 p-3 text-hibiscus">
                <Sparkles />
              </div>
              <h3 className="text-2xl font-bold text-ink">Add an idea</h3>
            </div>
            <SuggestionForm />
          </Card>
          <SuggestionsBoard suggestions={generalSuggestions} />
        </div>
      </section>

      <MemoryWall />

      <footer className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[28px] bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Ready for Ko Olina.</p>
            <p className="mt-1 text-sm text-white/65">
              Early mornings, flexible afternoons, and a shared place for every good idea.
            </p>
          </div>
          <div className="flex gap-2 text-sunrise">
            <Sun /><Waves /><TentTree /><Heart /><Star />
          </div>
        </div>
      </footer>
    </main>
  );
}
