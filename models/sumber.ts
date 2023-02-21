import { DB } from "$sqlite/mod.ts";
import { PuuRef } from "./peraturan.ts";

export type SumberPeraturan = {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
};

export const getSumberPeraturan = (
  db: DB,
  jenis: string,
  tahun: string,
  nomor: string,
) => {
  return db.queryEntries<SumberPeraturan>(
    `SELECT * FROM sumber WHERE puu = :key`,
    [`${jenis}/${tahun}/${nomor}`],
  );
};
