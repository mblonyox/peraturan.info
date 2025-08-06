import { create, insert } from "@orama/orama";
import { persistToFile } from "@orama/plugin-data-persistence/server";

import { getDB } from "~/lib/db/mod.ts";
import { getListPeraturan } from "~/models/peraturan.ts";
import { readTextMd } from "~/utils/fs.ts";

try {
  const index = await create({
    schema: {
      path: "string",
      jenis: "string",
      tahun: "number",
      nomor: "string",
      judul: "string",
      tanggal: "number",
      teks: "string",
    } as const,
    language: "indonesian",
  });

  const db = await getDB();
  const { hasil } = getListPeraturan(db, { pageSize: 20000 });
  for (const p of hasil) {
    const md = await readTextMd({
      jenis: p.jenis,
      tahun: p.tahun,
      nomor: p.nomor,
    });
    await insert(index, {
      path: p.path,
      jenis: p.namaJenisPanjang,
      nomor: p.nomorPanjang,
      judul: p.judul,
      tahun: p.tahun,
      tanggal: p.tanggal_ditetapkan.getTime(),
      teks: md ?? "",
    });
  }

  // deno-lint-ignore no-explicit-any
  await persistToFile(index as any, "dpack", "data/index.dpack");
} catch (error) {
  console.error(error);
}
