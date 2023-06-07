import { Handlers } from "$fresh/server.ts";
import { search } from "@orama/orama";
import { boundedLevenshtein } from "@orama/orama/internals";
import { getOrama } from "@/data/orama.ts";

export const handler: Handlers = {
  GET: async (req, _ctx) => {
    try {
      const query = new URL(req.url).searchParams.get("query")?.trim();
      if (!query || query.length < 3) return new Response(JSON.stringify([]));
      const index = await getOrama();
      const result = await search(index, {
        term: query,
        properties: ["judul"],
        limit: 50,
      });
      const items = await Promise.all(result.hits.map(
        async (hit) => {
          const judul_words = (hit.document.judul as string).split(/\s+/);
          const query_words = query.split(/\s+/);
          const start = await findNearestWordIndex(judul_words, query_words);
          if (start) {
            return judul_words.slice(start, start + 5).join(" ").toLowerCase()
              .replaceAll(
                /[^a-z0-9\ ]+/g,
                "",
              );
          }
        },
      ));
      return new Response(JSON.stringify([...new Set(items.filter(Boolean))]));
    } catch (error) {
      return new Response(`Internal Server Error: ${error}`, { status: 500 });
    }
  },
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
