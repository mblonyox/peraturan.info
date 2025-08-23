import { define } from "~/utils/define.ts";
import { readTextMd } from "~/utils/fs.ts";
import { HttpError } from "fresh";

export const handler = define.middleware(async (ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) throw new HttpError(404);
  ctx.state.md = md;
  return ctx.next();
});
