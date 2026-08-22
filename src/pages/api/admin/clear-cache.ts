import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { z } from "zod";

import { getData } from "@/lib/utils/data";

const payloadSchema = z.object({
  path: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const POST: APIRoute = async ({ cache, request }) => {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== env.ADMIN_API_KEY) {
      return Response.json(
        { ok: false, error: "Invalid API key" },
        { status: 401 },
      );
    }
    const { path, tags } = payloadSchema.parse(await request.json());
    await cache.invalidate({ path, tags });
    await Promise.all(
      (tags ?? [])
        .filter((t) => /^\s+\/\d{4}\/\d+$/.test(t))
        .map(async (t) => [
          await getData(t + "/fulltext.md", { cache: "no-cache" }),
          await getData(t + "/thumbnail.png", { cache: "no-cache" }),
        ]),
    );

    return Response.json({ ok: true });
  } catch (error: unknown) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
