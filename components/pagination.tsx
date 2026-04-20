"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationProps = {
  page: number;
  maxItems?: number;
} & (
  | {
      total: number;
      pageSize: number;
      lastPage?: never;
    }
  | {
      total?: never;
      pageSize?: never;
      lastPage: number;
    }
);

export default function Pagination({
  total,
  page,
  pageSize,
  lastPage,
  maxItems,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    const q = new URLSearchParams(searchParams);
    q.set("page", `${page}`);
    return pathname + "?" + q.toString();
  };

  return (
    <nav
      aria-label="Laman-laman hasil pencarian"
      className="flex justify-center my-2"
    >
      <div className="join join-horizontal">
        {page === 1 ? (
          <button type="button" className="join-item btn" disabled>
            <span>&lt;</span>
          </button>
        ) : (
          <Link
            className={clsx("join-item btn", page === 1 && "disabled")}
            href={pageUrl(page - 1)}
          >
            &lt;
          </Link>
        )}

        {!items.includes(1) && (
          <>
            <Link href={pageUrl(1)} className="join-item btn">
              {1}
            </Link>
            {Math.min(...items) > 2 && (
              <button type="button" className="join-item btn">
                <span>&#8230;</span>
              </button>
            )}
          </>
        )}
        {items.map((i) => (
          <Link
            key={i}
            className={clsx("join-item btn", page === i && "btn-active")}
            href={pageUrl(i)}
          >
            {i}
          </Link>
        ))}
        {!items.includes(lastPage) && (
          <>
            {Math.max(...items) < lastPage - 1 && (
              <button type="button" className="join-item btn">
                <span>&#8230;</span>
              </button>
            )}
            <Link className="join-item btn" href={pageUrl(lastPage)}>
              {lastPage}
            </Link>
          </>
        )}
        {page === lastPage ? (
          <button type="button" className="join-item btn" disabled>
            <span>&gt;</span>
          </button>
        ) : (
          <Link className="join-item btn" href={pageUrl(page + 1)}>
            &gt;
          </Link>
        )}
      </div>
    </nav>
  );
}
