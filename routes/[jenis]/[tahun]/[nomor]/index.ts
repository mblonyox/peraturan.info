import { HttpError } from "fresh";

import { getDB } from "~/lib/db/mod.ts";
import { getPeraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { existsMd } from "~/utils/fs.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    const req = ctx.req;
    const { jenis, tahun, nomor } = ctx.params;
    const db = await getDB();
    const peraturan = getPeraturan(db, jenis, tahun, nomor);
    if (!peraturan) throw new HttpError(404);
    const subPath = await existsMd({ jenis, tahun, nomor }) ? "/isi" : "/info";
    return Response.redirect(
      req.url + subPath,
      302,
    );
  },
});
