import type { APIRoute } from "astro";

import { createClient, type Peraturan } from "@/lib/typesense";

export const GET: APIRoute = async ({ request, cache }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim();
    if (!query || query.length < 3) return Response.json([]);
    const client = createClient();
    const response = await client
      .collections<Peraturan>("peraturan")
      .documents()
      .search({
        q: query,
        query_by: "judul",
      });
    const items = (response.hits ?? [])
      .map((hit) => hit.highlights?.find((h) => h.field === "judul")?.snippet)
      .filter((s): s is string => !!s);
    cache.set({
      maxAge: 604800,
      swr: 2592000,
      tags: ["autocomplete"],
    });
    return Response.json([...new Set(items)]);
  } catch (error) {
    return Response.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
};
