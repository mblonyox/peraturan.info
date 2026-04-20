import { search } from "@orama/orama";
import { cache } from "react";
import { notFound } from "next/navigation";
import { z } from "zod";

import Pagination from "@/components/pagination";
import { ellipsis } from "@/utils/string";
import { getOrama } from "@/lib/orama";

type Props = PageProps<"/search">;

const searchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().max(100).min(5).default(10),
  query: z.string().optional().default(""),
});

const getResults = cache(async (props: Props) => {
  const searchParams = await props.searchParams;
  const res = searchParamsSchema.safeParse(searchParams);
  if (!res.success) throw Error("Invalid search parameters");
  const { page, limit, query } = res.data;
  const offset = (page - 1) * limit;
  const index = await getOrama();
  const results = await search(index, {
    term: query,
    properties: ["jenis", "nomor", "judul"],
    offset,
    limit,
  });
  if (results.count && !results.hits.length) notFound();
  const title = "Hasil Pencarian";
  const start = offset + 1;
  const end = offset + results.hits.length;
  const description = results.hits.length
    ? `Pencarian dengan kata kunci "${query}" menampilkan urutan ${
        start === end ? start : start + " s.d. " + end
      } dari ${results.count} hasil dalam ${results.elapsed.formatted}.`
    : "Pencarian tidak menemukan hasil.";
  return {
    results,
    paginationProps: { page, lastPage: Math.ceil(results.count / limit) },
    title,
    description,
  };
});

export async function generateMetadata(props: Props) {
  const { title, description } = await getResults(props);
  return {
    title,
    description,
  };
}

export default async function Page(props: Props) {
  const { results, paginationProps } = await getResults(props);
  return (
    <div className="container">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
        {results.hits.map((hit) => (
          <div key={hit.id} className="card card-border shadow-sm">
            <div className="card-body">
              <p className="card-title line-clamp-3 text-xl font-bold">
                {hit.document.judul as string}
              </p>
              <p className="font-light">
                {hit.document.jenis} {hit.document.nomor}
              </p>
              <p>{ellipsis(hit.document.teks as string)}</p>
              <div className="card-actions justify-end">
                <a
                  href={hit.document.path as string}
                  className="btn btn-outline"
                >
                  Buka
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination {...paginationProps} />
    </div>
  );
}
