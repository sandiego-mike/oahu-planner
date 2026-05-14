"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { subscribeSuggestions, subscribeComments } from "@/lib/store";
import type { Suggestion, TripComment } from "@/lib/types";

type DataContextType = { suggestions: Suggestion[]; comments: TripComment[] };
const DataContext = createContext<DataContextType>({ suggestions: [], comments: [] });

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [comments, setComments] = useState<TripComment[]>([]);

  useEffect(() => {
    let unsubSuggestions = subscribeSuggestions(setSuggestions);
    let unsubComments = subscribeComments(setComments);

    function refresh() {
      unsubSuggestions();
      unsubComments();
      unsubSuggestions = subscribeSuggestions(setSuggestions);
      unsubComments = subscribeComments(setComments);
    }

    window.addEventListener("oahu-data-refresh", refresh);
    return () => {
      window.removeEventListener("oahu-data-refresh", refresh);
      unsubSuggestions();
      unsubComments();
    };
  }, []);

  return <DataContext.Provider value={{ suggestions, comments }}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
