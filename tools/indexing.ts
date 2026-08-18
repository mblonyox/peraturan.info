import { loadEnvFile } from "node:process";

import { getListPeraturan } from "@/lib/db";
import { createClient, peraturanSchema } from "@/lib/typesense";

loadEnvFile();

try {
  const client = createClient();
  await client.collections().create(peraturanSchema);

  for (let page = 1; true; page++) {
    const { hasil } = await getListPeraturan({ page, pageSize: 10000 });
    const documents = hasil.map((p) => ({
      path: p.path,
      jenis: p.namaJenisPanjang,
      nomor: p.nomor,
      judul: p.judul,
      tahun: p.tahun,
      tanggal: p.tanggal_ditetapkan.toISOString().split("T")[0],
    }));
    await client.collections("peraturan").documents().import(documents);
  }
} catch (error) {
  console.error(error);
}
