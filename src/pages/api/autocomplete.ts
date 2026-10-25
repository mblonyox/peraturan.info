import type { APIRoute } from "astro";

import { DAY, WEEK } from "@/lib/constants";
import { searchAutocomplete } from "@/lib/typesense";

export const GET: APIRoute = async ({ request, cache }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim();
    if (!query || query.length < 3) return Response.json([]);
    const items = await searchAutocomplete(query);
    cache.set({
      maxAge: DAY,
      swr: WEEK,
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
