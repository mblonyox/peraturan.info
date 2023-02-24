import { useAppContext } from "@/utils/app_context.tsx";

type PaginationProps =
  & {
    page: number;
    maxItems?: number;
  }
  & ({
    total: number;
    pageSize: number;
    lastPage?: never;
  } | {
    total?: never;
    pageSize?: never;
    lastPage: number;
  });

export default function Pagination({
  total,
  page,
  pageSize,
  lastPage,
  maxItems,
}: PaginationProps) {
  const { url } = useAppContext();
  const searchParams = new URLSearchParams(new URL(url ?? "").search);
  lastPage ??= Math.ceil((total ?? 0) / (pageSize ?? 10));
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
    const params = new URLSearchParams(searchParams);
    params.set("page", `${page}`);
    return `?${params.toString()}`;
  };

  return (
    <nav aria-label="Laman-laman hasil pencarian">
      <ul className="pagination justify-content-center">
        <li className={"page-item" + (page === 1 ? " disabled" : "")}>
          <a className="page-link" href={pageUrl(1)} disabled={page === 1}>
            Awal
          </a>
        </li>
        {items.map((i) => (
          <li className={"page-item" + (page === i ? " active" : "")}>
            <a
              className="page-link"
              href={pageUrl(i)}
            >
              {i}
            </a>
          </li>
        ))}
        <li className={"page-item" + (page === lastPage ? " disabled" : "")}>
          <a
            className="page-link"
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
