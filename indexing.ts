import { getDB } from "@/data/db.ts";
import { getListPeraturan } from "@/models/peraturan.ts";

const db = await getDB();
const { hasil } = await getListPeraturan(db, { pageSize: 20000 });

const indexes = hasil.map((p) => ({
  objectID: p.path,
  jenis: p.namaJenisPanjang,
  nomor: p.nomorPanjang,
  judul: p.judul,
  tanggal: p.tanggal_ditetapkan.getTime(),
  partial: "rujuk_panjang",
  content: p.rujukPanjang,
}));

Deno.writeTextFile("index.json", JSON.stringify(indexes));
