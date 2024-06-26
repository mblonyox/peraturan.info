import { Handlers } from "$fresh/server.ts";
import { getDB } from "@/lib/db/mod.ts";
import { getPeraturan } from "@/models/mod.ts";
import { existsMd } from "@/utils/fs.ts";

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const { jenis, tahun, nomor } = ctx.params;
    const db = await getDB();
    const peraturan = getPeraturan(db, jenis, tahun, nomor);
    if (!peraturan) return ctx.renderNotFound();
    const subPath = await existsMd({ jenis, tahun, nomor }) ? "/isi" : "/info";
    return Response.redirect(
      req.url + subPath,
      302,
    );
  },
};
