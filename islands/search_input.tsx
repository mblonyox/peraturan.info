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
    <form className="d-flex mx-lg-2" role="search" action="/search">
      <div className="input-group">
        <input
          name="query"
          className="form-control border-secondary border-end-0"
          style={{ width: 0 }}
          type="search"
          list="autocomplete-list"
          placeholder="Pencarian..."
          aria-label="Pencarian"
          value={query.value}
          onInput={(e) => query.value = e.currentTarget.value}
        />
        <button className="btn btn-outline-secondary" type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
            alt="Cari"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </button>
      </div>
      <datalist id="autocomplete-list">
        {options.value.map((value) => <option value={value} />)}
      </datalist>
    </form>
  );
}
