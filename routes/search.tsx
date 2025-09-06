import { type Results, search, type TypedDocument } from "@orama/orama";
import Pagination from "~/components/pagination.tsx";
import { getOrama } from "~/lib/orama/mod.ts";
import { define } from "~/utils/define.ts";
import { ellipsis } from "~/utils/string.ts";
import { $pageLimit, $searchParams } from "~/utils/validate.ts";
import { HttpError } from "fresh";
import { z } from "zod";

interface Data {
  results: Results<TypedDocument<Awaited<ReturnType<typeof getOrama>>>>;
  paginationProps: { page: number; lastPage: number };
}

export const handler = define.handlers<Data>({
  GET: async (ctx) => {
    const res = $searchParams.pipe(z.object({
      ...$pageLimit.shape,
      query: z.string().default(""),
    })).safeParse(ctx.url.searchParams);
    if (!res.success) throw new HttpError(400, res.error.message);
    const { page, limit, query } = res.data;
    const offset = (page - 1) * limit;
    const index = await getOrama();
    const results = await search(index, {
      term: query,
      properties: ["jenis", "nomor", "judul"],
      offset,
      limit,
    });
    if (results.count && !results.hits.length) throw new HttpError(404);
    const title = "Hasil Pencarian";
    const start = offset + 1;
    const end = offset + results.hits.length;
    const description = results.hits.length
      ? `Pencarian dengan kata kunci "${query}" menampilkan urutan ${
        start === end ? start : start + " s.d. " + end
      } dari ${results.count} hasil dalam ${results.elapsed.formatted}.`
      : "Pencarian tidak menemukan hasil.";
    ctx.state.seo = {
      title,
      description,
    };
    ctx.state.breadcrumbs = [{ name: "Pencarian" }];
    ctx.state.pageHeading = {
      title,
      description,
    };
    return {
      data: {
        results,
        paginationProps: { page, lastPage: Math.ceil(results.count / limit) },
      },
    };
  },
});

export default define.page<typeof handler>(
  ({ data: { results, paginationProps }, url }) => (
    <div className="container">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
        {results.hits.map((hit) => (
          <div className="card card-border shadow-sm">
            <div className="card-body">
              <p className="card-title line-clamp-3 text-xl font-bold">
                {hit.document.judul as string}
              </p>
              <p className="font-light">
                {hit.document.jenis} {hit.document.nomor}
              </p>
              <p>
                {ellipsis(hit.document.teks as string)}
              </p>
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
      <Pagination
        url={url}
        page={paginationProps.page}
        lastPage={paginationProps.lastPage}
      />
    </div>
  ),
);
