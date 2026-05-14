"use client";

import { Heart, Sparkles, Star, Sun, TentTree, Waves } from "lucide-react";
import { useData } from "@/components/DataProvider";
import { SuggestionForm } from "@/components/SuggestionForm";
import { SuggestionsBoard } from "@/components/SuggestionsBoard";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
          text="Restaurants, beaches, trails, links, and family reactions all live here."
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
