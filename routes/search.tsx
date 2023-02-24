import { v5 } from "$std/uuid/mod.ts";
import { Handler, PageProps } from "$fresh/server.ts";
import algoliasearch from "algoliasearch/lite";
import { SearchResponse } from "@algolia/client-search";
import { createFetchRequester } from "@algolia/requester-fetch";
import { AppContextState } from "@/utils/app_context.tsx";
import Pagination from "@/components/pagination.tsx";

const APP_ID = Deno.env.get("ALGOLIA_APP_ID");
const API_KEY = Deno.env.get("ALGOLIA_API_KEY");
const USERTOKEN_NAMESPACE = "3fb1c46a-c804-42cf-a4f2-01b949c0694e";

export const handler: Handler<SearchPageProps, AppContextState> = async (
  req,
  ctx,
) => {
  if (!APP_ID || !API_KEY) {
    throw Error("Environment Variable for Search not provided.");
  }
  const params = new URL(req.url).searchParams;
  const query = params.get("query") ?? "";
  const pageSize = parseInt(params.get("pageSize") ?? "10");
  const page = parseInt(params.get("page") ?? "1");
  const userToken = await v5.generate(
    USERTOKEN_NAMESPACE,
    new TextEncoder().encode(
      (ctx.remoteAddr as Deno.NetAddr).hostname + "|" +
        req.headers.get("user-agent"),
    ),
  );
  const searchClient = algoliasearch(APP_ID, API_KEY, {
    requester: createFetchRequester(),
  });
  const index = searchClient.initIndex("peraturan");
  const result = await index.search<SearchRow>(query, {
    attributesToRetrieve: ["judul", "nomor", "jenis"],
    attributesToSnippet: ["content"],
    attributesToHighlight: [],
    hitsPerPage: pageSize,
    page,
    headers: {
      "X-Algolia-UserToken": userToken,
    },
  });
  const offset = (result.page - 1) * result.hitsPerPage;
  const title = "Hasil Pencarian";
  const description = result.hits.length
    ? `Pencarian dengan kata kunci "${result.query}" menampilkan ${
      offset + 1
    } s.d. ${
      offset + result.hits.length
    } dari ${result.nbHits} hasil dalam ${result.processingTimeMS} ms.`
    : "Pencarian tidak menemukan hasil.";
  result.nbPages;
  ctx.state.seo = {
    title,
    description,
  };
  ctx.state.breadcrumbs = [{ name: "Pencarian" }];
  ctx.state.pageHeading = {
    title,
    description,
  };
  return ctx.render({ result });
};

type SearchRow = {
  judul: string;
  nomor: string;
  jenis: string;
  content: string;
};

type SearchPageProps = {
  result: SearchResponse<SearchRow>;
};

export default function SearchPage(
  { data: { result } }: PageProps<SearchPageProps>,
) {
  return (
    <>
      <div className="row column-gap-0 row-gap-3">
        {result.hits.map((hit) => (
          <div className="col-lg-6 col-xl-4">
            <div className="card h-100">
              <div className="card-body">
                <p className="card-title h5 fw-bold text-truncate d-block">
                  {hit.judul}
                </p>
                <p className="card-subtitle fw-light">
                  {hit.jenis} {hit.nomor}
                </p>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{
                    __html: hit._snippetResult?.content.value ?? "",
                  }}
                />
                <a
                  href={hit.objectID}
                  className="card-link btn btn-outline-secondary"
                >
                  Buka
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={result.page} lastPage={result.nbPages} />
    </>
  );
}
