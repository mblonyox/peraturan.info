import { getPeraturanMarkdown } from "~/utils/data.ts";
import { define } from "~/utils/define.ts";

export const handler = define.handlers(async (ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const md = await getPeraturanMarkdown({ jenis, tahun, nomor });
  ctx.state.md = md;
  const subPath = md ? "/isi" : "/info";
  return Response.redirect(ctx.url + subPath, 302);
});
