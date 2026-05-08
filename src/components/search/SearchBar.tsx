"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search for resources..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce logic for instant search feeling
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 150); // Very fast debounce for 'instant' feel

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative group w-full max-w-2xl">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted group-focus-within:text-primary transition-colors">
        <Search size={20} />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full bg-[#18181b] border border-border text-foreground text-sm rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary block pl-12 pr-12 py-4 transition-all shadow-sm placeholder:text-muted"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
