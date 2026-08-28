import { AxiosError } from "axios";
import { env } from "cloudflare:workers";
import { Client } from "typesense";
import { z } from "zod";

import {
  peraturanCollectionSchema,
  type PeraturanDocument,
  peraturanDocumentSchema,
} from "./schema";

export const client = new Client({
  apiKey: env.TYPESENSE_API_KEY,
  nodes: [{ url: env.TYPESENSE_URL }],
  axiosAdapter: (config) =>
    new Promise((resolve, reject) => {
      fetch(config.url ?? "", {
        method: config.method?.toUpperCase() ?? "GET",
        headers: (config.headers?.toJSON() ?? {}) as HeadersInit,
        body: config.data,
        signal: config.signal as AbortSignal,
      })
        .then(async (fetchResponse) => {
          const responseData = await fetchResponse.text();

          const response = {
            data: responseData,
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            headers: Object.fromEntries(fetchResponse.headers.entries()),
            config,
            request: null,
          };
          const validateStatus = response.config.validateStatus;
          if (
            !response.status ||
            !validateStatus ||
            validateStatus(response.status)
          ) {
            resolve(response);
          } else {
            reject(
              new AxiosError(
                "Request failed with status code " + response.status,
                response.status >= 400 && response.status < 500
                  ? AxiosError.ERR_BAD_REQUEST
                  : AxiosError.ERR_BAD_RESPONSE,
                response.config,
                response.request,
                response,
              ),
            );
          }
        })
        .catch(reject);
    }),
  useServerSideSearchCache: true,
});

export async function createCollection() {
  if (await client.collections("peraturan").exists()) return;
  await client.collections().create(peraturanCollectionSchema);
}

export async function indexDocuments(documents: unknown[]) {
  const validDocuments = await z
    .array(peraturanDocumentSchema)
    .parseAsync(documents);
  return await client
    .collections<PeraturanDocument>("peraturan")
    .documents()
    .import(validDocuments, { action: "upsert", return_id: true });
}

export async function searchDocuments(
  q: string,
  offset?: number,
  limit?: number,
) {
  return await client
    .collections<PeraturanDocument>("peraturan")
    .documents()
    .search({
      q,
      offset,
      limit,
      query_by: "judul, jenis, nomor",
      facet_by: "jenis, tahun",
    });
}

export async function searchAutocomplete(q: string) {
  const response = await client
    .collections<PeraturanDocument>("peraturan")
    .documents()
    .search({
      q,
      query_by: "judul",
      highlight_start_tag: "",
      highlight_end_tag: "",
      highlight_affix_num_tokens: 2,
      snippet_threshold: 10,
      drop_tokens_threshold: 5,
      drop_tokens_mode: "right_to_left",
    });
  const items = (response.hits ?? [])
    .map((hit) => {
      const snippet = hit.highlight.judul?.snippet;
      if (!snippet) return null;
      const tokens = hit.highlight.judul?.matched_tokens ?? [];
      const start = Math.min(...tokens.map((t) => snippet.indexOf(t)));
      if (start < 0) return null;
      return snippet.substring(start);
    })
    .filter((s): s is string => !!s);
  return [...new Set(items)].sort((a, b) => a.length - b.length);
}
