"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { subscribeSuggestions, subscribeComments, subscribeSavedPlaces } from "@/lib/store";
import type { SavedPlace, Suggestion, TripComment } from "@/lib/types";

type DataContextType = {
  suggestions: Suggestion[];
  comments: TripComment[];
  savedPlaces: SavedPlace[];
};

const DataContext = createContext<DataContextType>({ suggestions: [], comments: [], savedPlaces: [] });

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [comments, setComments] = useState<TripComment[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  useEffect(() => {
    let unsubSuggestions = subscribeSuggestions(setSuggestions);
    let unsubComments = subscribeComments(setComments);
    let unsubPlaces = subscribeSavedPlaces(setSavedPlaces);

    function refresh() {
      unsubSuggestions();
      unsubComments();
      unsubPlaces();
      unsubSuggestions = subscribeSuggestions(setSuggestions);
      unsubComments = subscribeComments(setComments);
      unsubPlaces = subscribeSavedPlaces(setSavedPlaces);
    }

    window.addEventListener("oahu-data-refresh", refresh);
    return () => {
      window.removeEventListener("oahu-data-refresh", refresh);
      unsubSuggestions();
      unsubComments();
      unsubPlaces();
    };
  }, []);

  return (
    <DataContext.Provider value={{ suggestions, comments, savedPlaces }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
