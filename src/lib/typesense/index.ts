import { env } from "cloudflare:workers";
import { Client } from "typesense";
import z from "zod";

import {
  peraturanCollectionSchema,
  type PeraturanDocument,
  peraturanDocumentSchema,
} from "./schema";

export const client = new Client({
  apiKey: env.TYPESENSE_API_KEY,
  nodes: [{ url: env.TYPESENSE_URL }],
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
    });
}

export async function searchAutocomplete(q: string) {
  const response = await client
    .collections<PeraturanDocument>("peraturan")
    .documents()
    .search({ q, query_by: "judul" });
  const items = (response.hits ?? [])
    .map((hit) => hit.highlights?.find((h) => h.field === "judul")?.snippet)
    .filter((s): s is string => !!s);
  return [...new Set(items)];
}
