import type { Database } from "better-sqlite3";
import type { PuuRef } from "./peraturan";

export type SumberPeraturan = {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
};

export const getSumberPeraturan = (
  db: Database,
  jenis: string,
  tahun: string,
  nomor: string,
) =>
  db
    .prepare<
      unknown[],
      SumberPeraturan
    >(`SELECT * FROM sumber WHERE puu = :key`)
    .all([`${jenis}/${tahun}/${nomor}`]);
