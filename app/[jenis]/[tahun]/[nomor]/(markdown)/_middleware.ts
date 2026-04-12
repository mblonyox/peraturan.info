import { getPeraturanMarkdown } from "~/utils/data.ts";
import { define } from "~/utils/define.ts";
import { HttpError } from "fresh";

export const handler = define.middleware(async (ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const md = await getPeraturanMarkdown({ jenis, tahun, nomor });
  if (!md) throw new HttpError(404);
  ctx.state.md = md;
  return ctx.next();
});
