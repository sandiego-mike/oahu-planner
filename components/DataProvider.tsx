"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  subscribeComments,
  subscribeMemories,
  subscribeSavedPlaces,
  subscribeSuggestions
} from "@/lib/store";
import type { Memory, SavedPlace, Suggestion, TripComment } from "@/lib/types";

type DataContextType = {
  suggestions: Suggestion[];
  comments: TripComment[];
  savedPlaces: SavedPlace[];
  memories: Memory[];
};

const DataContext = createContext<DataContextType>({
  suggestions: [],
  comments: [],
  savedPlaces: [],
  memories: []
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [comments, setComments] = useState<TripComment[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    let unsubSuggestions = subscribeSuggestions(setSuggestions);
    let unsubComments = subscribeComments(setComments);
    let unsubPlaces = subscribeSavedPlaces(setSavedPlaces);
    let unsubMemories = subscribeMemories(setMemories);

    function refresh() {
      unsubSuggestions(); unsubComments(); unsubPlaces(); unsubMemories();
      unsubSuggestions = subscribeSuggestions(setSuggestions);
      unsubComments = subscribeComments(setComments);
      unsubPlaces = subscribeSavedPlaces(setSavedPlaces);
      unsubMemories = subscribeMemories(setMemories);
    }

    window.addEventListener("oahu-data-refresh", refresh);
    return () => {
      window.removeEventListener("oahu-data-refresh", refresh);
      unsubSuggestions(); unsubComments(); unsubPlaces(); unsubMemories();
    };
  }, []);

  return (
    <DataContext.Provider value={{ suggestions, comments, savedPlaces, memories }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
