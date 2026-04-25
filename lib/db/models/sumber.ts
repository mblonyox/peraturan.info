import type { DB } from "@mainframe-api/deno-sqlite";
import type { PeraturanParams, PuuRef } from "./peraturan";

export type SumberPeraturan = {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
};

export const getSumberPeraturan = (
  db: DB,
  { jenis, tahun, nomor }: PeraturanParams,
) =>
  db.queryEntries<SumberPeraturan>(`SELECT * FROM sumber WHERE puu = :key`, [
    `${jenis}/${tahun}/${nomor}`,
  ]);
