import type { APIRoute } from "astro";

import { searchAutocomplete } from "@/lib/typesense";

export const GET: APIRoute = async ({ request, cache }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim();
    if (!query || query.length < 3) return Response.json([]);
    const items = await searchAutocomplete(query);
    cache.set({
      maxAge: 604800,
      swr: 2592000,
      tags: ["autocomplete"],
    });
    return Response.json(items);
  } catch (error) {
    return Response.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
};
