import { type Results, search, type TypedDocument } from "@orama/orama";

import { getOrama } from "~/lib/orama/mod.ts";
import { ellipsis } from "~/utils/string.ts";
import { define } from "~/utils/define.ts";
import Pagination from "~/components/pagination.tsx";

interface Data {
  results: Results<TypedDocument<Awaited<ReturnType<typeof getOrama>>>>;
  paginationProps: { page: number; lastPage: number };
}

export const handler = define.handlers<Data>({
  GET: async (ctx) => {
    const params = ctx.url.searchParams;
    const query = params.get("query") ?? "";
    const limit = parseInt(params.get("limit") ?? "12");
    const page = parseInt(params.get("page") ?? "1");
    const offset = (page - 1) * limit;
    const index = await getOrama();
    const results = await search(index, {
      term: query,
      properties: ["jenis", "nomor", "judul"],
      offset,
      limit,
    });
    const title = "Hasil Pencarian";
    const description = results.hits.length
      ? `Pencarian dengan kata kunci "${query}" menampilkan ${
        offset + 1
      } s.d. ${
        offset + results.hits.length
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
