import { create, insert } from "@orama/orama";
import { persistToFile } from "@orama/plugin-data-persistence/server";

import { getDB, getListPeraturan } from "@/lib/db";
import { readOrFetch } from "@/utils/data";

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
  const { hasil } = await getListPeraturan(db, { pageSize: 20000 });
  for (const p of hasil) {
    const md = await readOrFetch(`${p.path}/fulltext.md`, "text");
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

  await persistToFile(index, "dpack", "data/index.dpack");
} catch (error) {
  console.error(error);
}
