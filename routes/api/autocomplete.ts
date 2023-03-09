import { Handlers } from "$fresh/server.ts";
import { search } from "@lyrasearch/lyra";
import { boundedLevenshtein } from "@lyrasearch/lyra/internals";
import { getLyra } from "@/data/lyra.ts";

export const handler: Handlers = {
  GET: async (req, _ctx) => {
    try {
      const query = new URL(req.url).searchParams.get("query")?.trim();
      if (!query || query.length < 3) return new Response(JSON.stringify([]));
      const index = await getLyra();
      const result = await search(index, {
        term: query,
        properties: ["judul"],
        limit: 50,
      });
      const items = result.hits.map(
        (hit) => {
          const judul_words = hit.document.judul.split(/\s+/);
          const query_words = query.split(/\s+/);
          const start = judul_words.findIndex((w) =>
            query_words.some((q) => boundedLevenshtein(q, w, 2.5).isBounded)
          );
          if (start < 0) return null;
          return judul_words.slice(start, start + 5).join(" ").toLowerCase()
            .replaceAll(
              /[^a-z0-9\ ]+/g,
              "",
            );
        },
      ).filter(Boolean);
      return new Response(JSON.stringify([...new Set(items)]));
    } catch (error) {
      return new Response(`Internal Server Error: ${error}`, { status: 500 });
    }
  },
};
