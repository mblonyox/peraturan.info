import { clsx } from "clsx";

type PaginationProps =
  & {
    url: URL;
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
  url,
  total,
  page,
  pageSize,
  lastPage,
  maxItems,
}: PaginationProps) {
  lastPage ??= Math.ceil((total ?? 0) / (pageSize ?? 10));
  const itemsSize = maxItems ?? 5;
  if (!lastPage || page < 1 || page > lastPage) return null;

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
    const p = new URL(url);
    p.searchParams.set("page", `${page}`);
    return p.href;
  };

  return (
    <nav
      aria-label="Laman-laman hasil pencarian"
      className="flex justify-center my-2"
    >
      <div className="join join-horizontal">
        {page === 1
          ? (
            <button type="button" className="join-item btn" disabled>
              <span>&lt;</span>
            </button>
          )
          : (
            <a
              className={clsx("join-item btn", page === 1 && "disabled")}
              href={pageUrl(page - 1)}
            >
              &lt;
            </a>
          )}

        {!items.includes(1) && (
          <>
            <a href={pageUrl(1)} className="join-item btn">{1}</a>
            {Math.min(...items) > 2 &&
              (
                <button type="button" className="join-item btn">
                  <span>&#8230;</span>
                </button>
              )}
          </>
        )}
        {items.map((i) => (
          <a
            className={clsx("join-item btn", page === i && "btn-active")}
            href={pageUrl(i)}
          >
            {i}
          </a>
        ))}
        {!items.includes(lastPage) && (
          <>
            {Math.max(...items) < lastPage - 1 &&
              (
                <button type="button" className="join-item btn">
                  <span>&#8230;</span>
                </button>
              )}
            <a className="join-item btn" href={pageUrl(lastPage)}>
              {lastPage}
            </a>
          </>
        )}
        {page === lastPage
          ? (
            <button type="button" className="join-item btn" disabled>
              <span>&gt;</span>
            </button>
          )
          : (
            <a
              className="join-item btn"
              href={pageUrl(page + 1)}
            >
              &gt;
            </a>
          )}
      </div>
    </nav>
  );
}
