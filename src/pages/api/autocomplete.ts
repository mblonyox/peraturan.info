import { search } from "@orama/orama";
import { boundedLevenshtein } from "@orama/orama/internals";
import type { APIRoute } from "astro";

import { getOrama } from "@/lib/orama";

export const GET: APIRoute = async ({ request, cache }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim();
    if (!query || query.length < 3) return Response.json([]);
    cache.set({
      maxAge: 604800,
      swr: 2592000,
      tags: ["autocomplete"],
    });
    const index = await getOrama();
    const result = await search(index, {
      term: query,
      properties: ["judul"],
      limit: 50,
    });
    const items = await Promise.all(
      result.hits.map(async (hit) => {
        const judul_words = (hit.document.judul as string).split(/\s+/);
        const query_words = query.split(/\s+/);
        const start = await findNearestWordIndex(judul_words, query_words);
        if (start) {
          return judul_words
            .slice(start, start + 5)
            .join(" ")
            .toLowerCase()
            .replaceAll(/[^a-z0-9\ ]+/g, "");
        }
      }),
    );
    return Response.json([...new Set(items.filter(Boolean))]);
  } catch (error) {
    return Response.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
};

async function findNearestWordIndex(
  words: string[],
  queries: string[],
): Promise<number | null> {
  for (const [i, w] of words.entries()) {
    for (const q of queries) {
      const metric = await boundedLevenshtein(q, w, 2.5);
      if (metric.isBounded) {
        return i;
      }
    }
  }
  return null;
}
