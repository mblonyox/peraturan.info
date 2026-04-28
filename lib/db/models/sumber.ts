import type { Database } from "better-sqlite3";

import type { PeraturanParams, PuuRef } from "./peraturan";

export interface SumberPeraturan {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
}

export const getSumberPeraturan = (
  db: Database,
  { jenis, tahun, nomor }: PeraturanParams,
) =>
  db
    .prepare<
      unknown[],
      SumberPeraturan
    >(`SELECT * FROM sumber WHERE puu = :key`)
    .all({ key: `${jenis}/${tahun}/${nomor}` });
