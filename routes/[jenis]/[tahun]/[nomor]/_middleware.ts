import { getDB } from "~/lib/db/mod.ts";
import { getPeraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { HttpError } from "fresh";

export const handler = define.middleware(async (ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) throw new HttpError(404);
  ctx.state.peraturan = peraturan;
  return ctx.next();
});
