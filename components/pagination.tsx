interface PaginationProps {
  url: URL | string;
  total: number;
  page: number;
  pageSize: number;
  maxItems?: number;
}

export default function Pagination({
  url,
  total,
  page,
  pageSize,
  maxItems,
}: PaginationProps) {
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
    const params = new URLSearchParams(new URL(url).search);
    params.set("page", `${page}`);
    return `?${params.toString()}`;
  };

  const isActive = (page: number) => {
    const params = new URLSearchParams(new URL(url).search);
    return (params.get("page") || 1) == page;
  };

  return (
    <nav style={{ justifyContent: "center" }}>
      <ul>
        {page !== 1 && (
          <li>
            <a href={pageUrl(1)}>{"Awal"}</a>
          </li>
        )}
        {items.map((i) => (
          <li>
            <a
              class="outline"
              href={pageUrl(i)}
              role={isActive(i) ? "button" : undefined}
            >
              {i}
            </a>
          </li>
        ))}
        {page !== lastPage && (
          <li>
            <a href={pageUrl(lastPage)}>{"Akhir"}</a>
          </li>
        )}
      </ul>
    </nav>
  );
}
