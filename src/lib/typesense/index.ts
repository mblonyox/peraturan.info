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
  axiosAdapter: "fetch",
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
