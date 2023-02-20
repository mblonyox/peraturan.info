import { useAppContext } from "../utils/app_context.tsx";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  maxItems?: number;
}

export default function Pagination({
  total,
  page,
  pageSize,
  maxItems,
}: PaginationProps) {
  const { url } = useAppContext();
  const lastPage = Math.ceil(total / pageSize);
  const itemsSize = maxItems ?? 5;

  const items = [page];
  let i = 1;
  while (items.length < itemsSize) {
    const prev = page - i;
    if (prev > 0) items.unshift(prev);
    if (items.length > itemsSize) break;
    const next = page + i;
    if (next <= lastPage) items.push(next);
    if (prev <= 0 && next > lastPage) break;
    i++;
  }

  const pageUrl = (page: number) => {
    const params = new URLSearchParams(new URL(url ?? "").search);
    params.set("page", `${page}`);
    return `?${params.toString()}`;
  };

  const isActive = (page: number) => {
    const params = new URLSearchParams(new URL(url ?? "").search);
    return (params.get("page") || 1) == page;
  };

  return (
    <nav aria-label="Laman-laman hasil pencarian">
      <ul class="pagination justify-content-center">
        <li class={"page-item" + (page === 1 ? " disabled" : "")}>
          <a class="page-link" href={pageUrl(1)} disabled={page === 1}>
            Awal
          </a>
        </li>
        {items.map((i) => (
          <li class={"page-item" + (page === i ? " active" : "")}>
            <a
              class="page-link"
              href={pageUrl(i)}
            >
              {i}
            </a>
          </li>
        ))}
        <li class={"page-item" + (page === lastPage ? " disabled" : "")}>
          <a
            class="page-link"
            href={pageUrl(lastPage)}
            disabled={page === lastPage}
          >
            Akhir
          </a>
        </li>
      </ul>
    </nav>
  );
}
