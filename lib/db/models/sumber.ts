import type { PeraturanParams, PuuRef } from "./peraturan";

export interface SumberPeraturan {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
}

export async function getSumberPeraturan(
  db: D1Database,
  { jenis, tahun, nomor }: PeraturanParams,
) {
  const { results } = await db
    .prepare(`SELECT * FROM sumber WHERE puu = ?`)
    .bind(`${jenis}/${tahun}/${nomor}`)
    .all();
  return results as unknown as SumberPeraturan[];
}
