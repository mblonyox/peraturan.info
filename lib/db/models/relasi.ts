import type { Database } from "better-sqlite3";
import { Peraturan, type PeraturanRow, type PuuRef } from "./peraturan";

export const JENIS2_RELASI = [
  "cabut",
  "cabut_sebagian",
  "ubah",
  "dasar_hukum",
  "tetapkan",
] as const;

export type JenisRelasi = (typeof JENIS2_RELASI)[number];

export type RelasiPeraturan = {
  id: number;
  puu1: PuuRef;
  relasi: JenisRelasi;
  puu2: PuuRef;
  catatan: string;
};

export const getRelasiPeraturan1 = (
  db: Database,
  jenis: string,
  tahun: string,
  nomor: string,
) =>
  db
    .prepare<unknown[], RelasiPeraturan & PeraturanRow>(
      `SELECT * FROM relasi LEFT JOIN peraturan ON relasi.puu2 = peraturan.jenis || '/' || peraturan.tahun || '/' || peraturan.nomor WHERE puu1 = :key`,
    )
    .all([`${jenis}/${tahun}/${nomor}`])
    .map(({ id, relasi, catatan, ...row }) => ({
      id,
      relasi,
      catatan,
      peraturan: new Peraturan(row),
    }));

export const getRelasiPeraturan2 = (
  db: Database,
  jenis: string,
  tahun: string,
  nomor: string,
) =>
  db
    .prepare<unknown[], RelasiPeraturan & PeraturanRow>(
      `SELECT * FROM relasi LEFT JOIN peraturan ON relasi.puu1 = peraturan.jenis || '/' || peraturan.tahun || '/' || peraturan.nomor WHERE puu2 = :key`,
    )
    .all([`${jenis}/${tahun}/${nomor}`])
    .map(({ id, relasi, catatan, ...row }) => ({
      id,
      relasi,
      catatan,
      peraturan: new Peraturan(row),
    }));
