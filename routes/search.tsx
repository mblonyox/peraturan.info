import { Handler, PageProps } from "$fresh/server.ts";
import { AppContext } from "@/utils/app_context.ts";
import { ellipsis } from "@/utils/string.ts";
import { Results, search, TypedDocument } from "@orama/orama";
import { getOrama } from "@/lib/orama/mod.ts";
import Pagination from "@/components/pagination.tsx";

export const handler: Handler<SearchPageProps, AppContext> = async (
  req,
  ctx,
) => {
  const params = new URL(req.url).searchParams;
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
    ? `Pencarian dengan kata kunci "${query}" menampilkan ${offset + 1} s.d. ${
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
  return ctx.render({
    results,
    paginationProps: { page, lastPage: Math.ceil(results.count / limit) },
  });
};

type SearchPageProps = {
  results: Results<TypedDocument<Awaited<ReturnType<typeof getOrama>>>>;
  paginationProps: { page: number; lastPage: number };
};

export default function SearchPage(
  { data: { results, paginationProps } }: PageProps<SearchPageProps>,
) {
  return (
    <>
      <div className="row my-3 my-lg-5 column-gap-0 row-gap-3">
        {results.hits.map((hit) => (
          <div className="col-lg-6 col-xl-4">
            <div className="card h-100">
              <div className="card-body">
                <p
                  className="card-title h5 fw-bold"
                  style={{
                    "-webkit-line-clamp": "3",
                    "-webkit-box-orient": "vertical",
                    display: "-webkit-box",
                    overflow: "hidden",
                  }}
                >
                  {hit.document.judul as string}
                </p>
                <p className="card-subtitle fw-light">
                  {hit.document.jenis} {hit.document.nomor}
                </p>
                <p className="card-text">
                  {ellipsis(hit.document.teks as string)}
                </p>
                <a
                  href={hit.document.path as string}
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
