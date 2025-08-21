import { z } from "zod";

import { define } from "~/utils/define.ts";
import { kv } from "~/lib/kv/mod.ts";

const getReactionsSchema = z.object({
  path: z.string(),
});

const postReactionSchema = z.object({
  path: z.string(),
  emoji: z.string().regex(/^\p{Emoji_Presentation}$/gu),
});

export const handler = define.handlers({
  GET: async (ctx) => {
    const input = Object.fromEntries(ctx.url.searchParams.entries());
    const { success, error, data } = await getReactionsSchema.safeParseAsync(
      input,
    );
    if (!success) {
      return Response.json({ error }, {
        status: 400,
      });
    }
    const entries = kv.list({ prefix: ["reactions", data.path] });
    const map = new Map<string, number>();
    for await (const { value } of entries) {
      map.set(value as string, (map.get(value as string) ?? 0) + 1);
    }
    const result = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return Response.json(result);
  },
  POST: async (ctx) => {
    const sessionId = ctx.state.sessionId!;
    const input = await ctx.req.json();
    const { success, error, data } = await postReactionSchema.safeParseAsync(
      input,
    );
    if (!success) {
      return Response.json({ error }, {
        status: 400,
      });
    }
    const { path, emoji } = data;
    const result = await kv.set(["reactions", path, sessionId], emoji);
    return Response.json(result);
  },
});
