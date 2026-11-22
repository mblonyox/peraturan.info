import { Icon } from "astro-iconset/react";
import { useEffect, useRef, useState } from "react";

async function getAutocomplete(query: string): Promise<string[]> {
  const url = new URL("/api/autocomplete", document.baseURI);
  url.searchParams.set("query", query);
  const response = await fetch(url);
  if (!response.ok) return [];
  return response.json();
}

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setQuery(searchParams.get("query") ?? "");

      function onKeyDown(event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && event.key === "k") {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }

      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, []);

  useEffect(() => {
    if (!query) {
      setOptions([]);
      return;
    }
    const timer = setTimeout(
      () => getAutocomplete(query).then((v) => setOptions(v)),
      300,
    );
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <form role="search" action="/search">
      <label className="input">
        <Icon name="ri:search-line" />
        <input
          ref={inputRef}
          name="query"
          type="search"
          list="autocomplete-list"
          placeholder="Pencarian..."
          aria-label="Pencarian"
          aria-controls="autocomplete-list"
          aria-expanded={!!options.length}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
        <kbd className="kbd hidden p-3 kbd-sm lg:flex">Ctrl</kbd>
        <kbd className="kbd hidden p-3 kbd-sm lg:flex">K</kbd>
      </label>
      <datalist id="autocomplete-list">
        {options.map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
    </form>
  );
}
