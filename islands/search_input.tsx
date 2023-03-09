import { useSignal } from "@preact/signals";

type Props = {
  initQuery?: string;
};

export default function SearchInput({ initQuery }: Props) {
  const query = useSignal(initQuery);
  return (
    <form className="d-flex mx-lg-2" role="search" action="/search">
      <div className="input-group">
        <input
          name="query"
          className="form-control border-secondary border-end-0"
          type="search"
          placeholder="Pencarian..."
          aria-label="Pencarian"
          value={query.value}
          onChange={(e) => query.value = e.currentTarget.value}
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
    </form>
  );
}
