"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import IconSearch from "@/components/icons/search";

async function getAutocomplete(query: string): Promise<string[]> {
  const url = new URL("/api/autocomplete", document.baseURI);
  url.searchParams.set("query", query);
  const response = await fetch(url);
  if (!response.ok) return [];
  return response.json();
}

export default function SearchInput() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getAutocomplete(query).then((value) => setOptions(value));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <form role="search" action="/search">
      <label className="input">
        <IconSearch />
        <input
          name="query"
          type="search"
          list="autocomplete-list"
          placeholder="Pencarian..."
          aria-label="Pencarian"
          value={query}
          onInput={(e) => setQuery(e.currentTarget.value)}
        />
        <kbd className="kbd kbd-sm p-3">⌘ K</kbd>
      </label>
      <datalist id="autocomplete-list">
        {options.map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
    </form>
  );
}
