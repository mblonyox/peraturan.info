import { create, insert } from "@orama/orama";
import { persistToFile } from "@orama/plugin-data-persistence/server";
import { getDB } from "@/data/db.ts";
import { getListPeraturan } from "@/models/peraturan.ts";
import { readTextMd } from "@/utils/fs.ts";

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
    },
    language: "indonesian",
  });

  const db = await getDB();
  const { hasil } = await getListPeraturan(db, { pageSize: 20000 });

  for (const p of hasil) {
    await insert(index, {
      path: p.path,
      jenis: p.namaJenisPanjang,
      nomor: p.nomorPanjang,
      judul: p.judul,
      tahun: p.tahun,
      tanggal: p.tanggal_ditetapkan.getTime(),
      teks:
        await readTextMd({ jenis: p.jenis, tahun: p.tahun, nomor: p.nomor }) ??
          "",
    });
  }
  persistToFile(index, "dpack", "data/index.dpack", "deno");
} catch (error) {
  console.error(error);
}
