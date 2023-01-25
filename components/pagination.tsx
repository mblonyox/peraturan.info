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
    const params = new URLSearchParams(document.location.search);
    params.set("page", `${page}`);
    return `?${params.toString()}`;
  };

  return (
    <nav>
      <ul>
        {page !== 1 && (
          <li>
            <a href={pageUrl(1)}>{"Awal"}</a>
          </li>
        )}
        {items.map((i) => (
          <li>
            <a href={pageUrl(i)}>{i}</a>
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
