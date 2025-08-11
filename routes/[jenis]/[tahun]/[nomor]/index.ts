import { define } from "~/utils/define.ts";
import { existsMd } from "~/utils/fs.ts";

export const handler = define.handlers(async (ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const subPath = await existsMd({ jenis, tahun, nomor }) ? "/isi" : "/info";
  return Response.redirect(
    ctx.url + subPath,
    302,
  );
});
