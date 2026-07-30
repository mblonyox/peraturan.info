import { Icon } from "astro-iconset/react";
import { useEffect, useState } from "react";

async function getAutocomplete(query: string): Promise<string[]> {
  const url = new URL("/api/autocomplete", document.baseURI);
  url.searchParams.set("query", query);
  const response = await fetch(url);
  if (!response.ok) return [];
  return response.json();
}

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setQuery(searchParams.get("query") ?? "");
    }
  }, []);

  useEffect(() => {
    if (!query) {
      setOptions([]);
      return;
    }
    const timer = setTimeout(() => {
      getAutocomplete(query).then((value) => setOptions(value));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <form role="search" action="/search">
      <label className="input">
        <Icon name="ri:search-line" />
        <input
          name="query"
          type="search"
          list="autocomplete-list"
          placeholder="Pencarian..."
          aria-label="Pencarian"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
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
