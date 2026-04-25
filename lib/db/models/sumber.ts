import type { DB, RowObject } from "@mainframe-api/deno-sqlite";

import type { PeraturanParams, PuuRef } from "./peraturan";

interface SumberPeraturanRow extends RowObject {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
}

export const getSumberPeraturan = (
  db: DB,
  { jenis, tahun, nomor }: PeraturanParams,
) =>
  db.queryEntries<SumberPeraturanRow>(`SELECT * FROM sumber WHERE puu = :key`, [
    `${jenis}/${tahun}/${nomor}`,
  ]);
