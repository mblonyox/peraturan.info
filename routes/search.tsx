import { Handler, PageProps } from "$fresh/server.ts";
import { AppContextState } from "@/utils/app_context.tsx";
import { search, SearchResult } from "@lyrasearch/lyra";
import { formatNanoseconds } from "@lyrasearch/lyra/internals";
import { getLyra, Schema } from "@/data/lyra.ts";
import Pagination from "@/components/pagination.tsx";

export const handler: Handler<SearchPageProps, AppContextState> = async (
  req,
  ctx,
) => {
  const params = new URL(req.url).searchParams;
  const query = params.get("query") ?? "";
  const limit = parseInt(params.get("limit") ?? "12");
  const page = parseInt(params.get("page") ?? "1");
  const offset = (page - 1) * limit;
  const index = await getLyra();
  const result = await search(index, {
    term: query,
    properties: ["jenis", "nomor", "judul"],
    offset,
    limit,
  });
  const title = "Hasil Pencarian";
  const description = result.hits.length
    ? `Pencarian dengan kata kunci "${query}" menampilkan ${offset + 1} s.d. ${
      offset + result.hits.length
    } dari ${result.count} hasil dalam ${
      formatNanoseconds(result.elapsed as bigint)
    }.`
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
  return ctx.render({
    result,
    paginationProps: { page, lastPage: Math.ceil(result.count / limit) },
  });
};

type SearchPageProps = {
  result: SearchResult<Schema>;
  paginationProps: { page: number; lastPage: number };
};

export default function SearchPage(
  { data: { result, paginationProps } }: PageProps<SearchPageProps>,
) {
  return (
    <>
      <div className="row my-3 my-lg-5 column-gap-0 row-gap-3">
        {result.hits.map((hit) => (
          <div className="col-lg-6 col-xl-4">
            <div className="card h-100">
              <div className="card-body">
                <p className="card-title h5 fw-bold text-truncate d-block">
                  {hit.document.judul}
                </p>
                <p className="card-subtitle fw-light">
                  {hit.document.jenis} {hit.document.nomor}
                </p>
                <p className="card-text">{hit.document.teks}</p>
                <a
                  href={hit.document.path}
                  className="card-link btn btn-outline-secondary"
                >
                  Buka
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        page={paginationProps.page}
        lastPage={paginationProps.lastPage}
      />
    </>
  );
}
