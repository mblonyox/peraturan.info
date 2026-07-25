import { env } from "cloudflare:workers";

import type { PeraturanParams, PuuRef } from "./peraturan";

const db = env.DATABASE;

export interface SumberPeraturan {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
}

export async function getSumberPeraturan({
  jenis,
  tahun,
  nomor,
}: PeraturanParams) {
  const { results } = await db
    .prepare(`SELECT * FROM sumber WHERE puu = ?`)
    .bind(`${jenis}/${tahun}/${nomor}`)
    .all();
  return results as unknown as SumberPeraturan[];
}
