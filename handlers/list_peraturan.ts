import { Handler } from "$fresh/server.ts";
import { ListPeraturanProps } from "../components/list_peraturan.tsx";
import { listPeraturan } from "../models/peraturan.ts";
import { getNamaJenis } from "../utils/const.ts";
import { db } from "../data/db.ts";

export const handler: Handler<ListPeraturanProps> = (req, ctx) => {
  const { jenis: kodeJenis, tahun } = ctx.params;
  const namaJenis = getNamaJenis(kodeJenis);
  if (kodeJenis !== "all" && !namaJenis) return ctx.renderNotFound();
  console.log(tahun);
  if (tahun?.length && (tahun?.length !== 4 || isNaN(parseInt(tahun)))) {
    return ctx.renderNotFound();
  }
  const searchParams = new URL(req.url).searchParams;
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10");

  const judul =
    (kodeJenis === "all" ? "semua peraturan" : (namaJenis ?? kodeJenis)) + (
      tahun ? ` pada tahun ${tahun}` : ""
    );

  const jenis = kodeJenis === "all" ? undefined : kodeJenis;
  const data = listPeraturan(db, { jenis, tahun, page, pageSize });

  return ctx.render({
    url: req.url,
    judul,
    ...data,
  });
};
