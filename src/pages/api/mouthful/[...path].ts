import type { APIRoute } from "astro";

export const ALL: APIRoute = async ({ params, request, cache }) => {
  const MOUTHFUL_URL = process.env.MOUTHFUL_URL;
  if (!MOUTHFUL_URL)
    return new Response("MOUTHFUL_URL is not defined", { status: 500 });
  const { search } = new URL(request.url);
  const targetUrl = new URL(params.path ?? "", MOUTHFUL_URL);
  targetUrl.search = search;
  const method = request.method;
  const body =
    method === "POST" || method === "PUT" || method === "PATCH"
      ? request.body
      : null;
  try {
    const response = await fetch(targetUrl, { method, body });
    const contentType = response.headers.get("content-type");
    const headers = new Headers();
    if (contentType) headers.set("content-type", contentType);
    if (method === "GET") {
      cache.set({
        maxAge: 86400,
        swr: 604800,
        tags: ["mouthful"],
      });
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch from Mouthful", {
      status: 502,
    });
  }
};
