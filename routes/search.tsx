import { Handler, PageProps } from "$fresh/server.ts";
import { AppContext } from "@/utils/app_context.tsx";
import { ellipsis } from "@/utils/string.ts";
import { Results, search } from "@orama/orama";
import { getOrama } from "@/data/orama.ts";
import Pagination from "@/components/pagination.tsx";

export const handler: Handler<SearchPageProps> = async (
  req,
  ctx,
) => {
  const params = new URL(req.url).searchParams;
  const query = params.get("query") ?? "";
  const limit = parseInt(params.get("limit") ?? "12");
  const page = parseInt(params.get("page") ?? "1");
  const offset = (page - 1) * limit;
  const index = await getOrama();
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
    } dari ${result.count} hasil dalam ${result.elapsed.formatted}.`
    : "Pencarian tidak menemukan hasil.";
  const appContext: AppContext = {};
  appContext.seo = {
    title,
    description,
  };
  appContext.breadcrumbs = [{ name: "Pencarian" }];
  appContext.pageHeading = {
    title,
    description,
  };
  return ctx.render({
    result,
    paginationProps: { page, lastPage: Math.ceil(result.count / limit) },
    appContext,
  });
};

type SearchPageProps = {
  result: Results;
  paginationProps: { page: number; lastPage: number };
  appContext: AppContext;
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
