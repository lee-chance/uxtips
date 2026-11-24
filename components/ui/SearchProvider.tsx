"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useState } from "react";

const SearchContext = createContext<{ query: string; setQuery: (q: string) => void }>({
  query: "",
  setQuery: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <MotionConfig reducedMotion="user">
      <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>
    </MotionConfig>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
