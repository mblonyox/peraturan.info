import { Peraturan, type PeraturanParams, type PuuRef } from "./peraturan";

export const JENIS2_RELASI = [
  "cabut",
  "cabut_sebagian",
  "ubah",
  "dasar_hukum",
  "tetapkan",
] as const;

export type JenisRelasi = (typeof JENIS2_RELASI)[number];

export interface RelasiPeraturan {
  id: number;
  puu1: PuuRef;
  relasi: JenisRelasi;
  puu2: PuuRef;
  catatan: string;
}

export async function getRelasiPeraturan1(
  db: D1Database,
  { jenis, tahun, nomor }: PeraturanParams,
) {
  const { results } = await db
    .prepare(
      `SELECT * FROM relasi LEFT JOIN peraturan ON relasi.puu2 = peraturan.jenis || '/' || peraturan.tahun || '/' || peraturan.nomor WHERE puu1 = ?`,
    )
    .bind(`${jenis}/${tahun}/${nomor}`)
    .all();
  return results.map(({ id, relasi, catatan, ...row }) => ({
    id: id as number,
    relasi: relasi as JenisRelasi,
    catatan: catatan as string,
    peraturan: Peraturan.fromRow(row),
  }));
}

export async function getRelasiPeraturan2(
  db: D1Database,
  { jenis, tahun, nomor }: PeraturanParams,
) {
  const { results } = await db
    .prepare(
      `SELECT * FROM relasi LEFT JOIN peraturan ON relasi.puu1 = peraturan.jenis || '/' || peraturan.tahun || '/' || peraturan.nomor WHERE puu2 = ?`,
    )
    .bind(`${jenis}/${tahun}/${nomor}`)
    .all();
  return results
    .filter((r) => r.jenis && r.tahun && r.nomor)
    .map(({ id, relasi, catatan, ...row }) => ({
      id: id as number,
      relasi: relasi as JenisRelasi,
      catatan: catatan as string,
      peraturan: Peraturan.fromRow(row),
    }));
}
