import { Handler } from "$fresh/server.ts";
import { ListPeraturanProps } from "../components/list_peraturan.tsx";
import { listPeraturan } from "../models/peraturan.ts";
import { JENIS_PERATURAN } from "../utils/const.ts";
import { db } from "../data/db.ts";

export const handler: Handler<ListPeraturanProps> = (req, ctx) => {
  const jenisPeraturan = JENIS_PERATURAN.find((j) =>
    j.kode === ctx.params.jenis
  );
  const { jenis, tahun } = ctx.params;
  const searchParams = new URL(req.url).searchParams;
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10");

  const judul = (jenisPeraturan?.nama ?? "peraturan") + (
    tahun ? ` pada tahun ${tahun}` : ""
  );
  const data = listPeraturan(db, { jenis, tahun, page, pageSize });

  return ctx.render({
    url: req.url,
    judul,
    ...data,
  });
};
