import { useSignal, useSignalEffect } from "@preact/signals";

async function getAutocomplete(query: string): Promise<string[]> {
  const url = new URL("/api/autocomplete", document.baseURI);
  url.searchParams.set("query", query);
  const response = await fetch(url);
  if (!response.ok) throw Error(response.statusText);
  return response.json();
}

type Props = {
  initQuery?: string;
};

export default function SearchInput({ initQuery }: Props) {
  const query = useSignal(initQuery);
  const options = useSignal<string[]>([]);
  const debounceId = useSignal<number | undefined>(undefined);
  useSignalEffect(() => {
    const q = query.value ?? "";
    if (typeof debounceId.peek() == "number") clearTimeout(debounceId.peek());
    debounceId.value = setTimeout(() => {
      getAutocomplete(q)
        .then((value) => options.value = value);
    }, 300);
    return () => clearTimeout(debounceId.peek());
  });
  return (
    <form role="search" action="/search">
      <label className="input">
        <svg
          class="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          name="query"
          type="search"
          list="autocomplete-list"
          placeholder="Pencarian..."
          aria-label="Pencarian"
          value={query.value}
          onInput={(e) => query.value = e.currentTarget.value}
        />
        <kbd className="kbd kbd-sm p-3">⌘ K</kbd>
      </label>
      <datalist id="autocomplete-list">
        {options.value.map((value) => <option value={value} key={value} />)}
      </datalist>
    </form>
  );
}
