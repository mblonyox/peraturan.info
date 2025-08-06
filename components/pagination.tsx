import { useAppContext } from "~/utils/app_context.ts";

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
          <a
            className="page-link"
            href={page === 1 ? "#" : pageUrl(page - 1)}
          >
            &lt;
          </a>
        </li>
        {!items.includes(1) && (
          <>
            <li className="page-item">
              <a
                className="page-link"
                href={pageUrl(1)}
              >
                {1}
              </a>
            </li>
            <li className="page-item">
              <span className="page-link">&#8230;</span>
            </li>
          </>
        )}
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
        {!items.includes(lastPage) && (
          <>
            <li className="page-item">
              <span className="page-link">&#8230;</span>
            </li>
            <li className="page-item">
              <a
                className="page-link"
                href={pageUrl(lastPage)}
              >
                {lastPage}
              </a>
            </li>
          </>
        )}
        <li className={"page-item" + (page === lastPage ? " disabled" : "")}>
          <a
            className="page-link"
            href={page === lastPage ? "#" : pageUrl(page + 1)}
          >
            &gt;
          </a>
        </li>
      </ul>
    </nav>
  );
}
