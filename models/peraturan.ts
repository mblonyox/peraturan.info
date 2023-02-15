import { DB } from "$sqlite/mod.ts";

export const JENIS2_PERATURAN = [
  "uu",
  "perppu",
  "pp",
  "perpres",
  "permenkeu",
] as const;

export type JenisPeraturan = typeof JENIS2_PERATURAN[number];

export type Peraturan = {
  jenis: JenisPeraturan;
  tahun: number;
  nomor: number;
  judul: string;
  tanggal_ditetapkan: Date;
  tanggal_diundangkan: Date;
  tanggal_berlaku: Date;
  nomor_text: string;
};

export type PuuRef = `${JenisPeraturan}/${number}/${number}`;

export type SumberPeraturan = {
  id: number;
  puu: PuuRef;
  nama: string;
  url_page: string;
  url_pdf: string;
};

export const JENIS2_RELASI = [
  "cabut",
  "cabut_sebagian",
  "ubah",
  "dasar_hukum",
] as const;

export type JenisRelasi = typeof JENIS2_RELASI[number];

export type RelasiPeraturan = {
  id: number;
  puu1: PuuRef;
  relasi: JenisRelasi;
  puu2: PuuRef;
  catatan: string;
};

// deno-lint-ignore no-explicit-any
function buildWhereClause({ ...params }: Record<string, any>) {
  (Object.keys(params) as Array<keyof typeof params>).forEach((key) => {
    if (!params[key]) {
      delete params[key];
    }
  });
  const conditions = Object.keys(params).map((key) => `${key} = :${key}`).join(
    " AND ",
  );
  return {
    whereClause: conditions ? ` WHERE ${conditions}` : "",
    whereParams: params,
  };
}

export const getListPeraturan = (db: DB, {
  jenis,
  tahun,
  page: pageParam,
  pageSize: pageSizeParam,
}: {
  jenis?: string;
  tahun?: string;
  page?: number;
  pageSize?: number;
}) => {
  const { whereClause, whereParams } = buildWhereClause({ jenis, tahun });
  const page = pageParam ?? 1;
  const pageSize = pageSizeParam ?? 10;
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const hasil = db.queryEntries<Peraturan>(
    `SELECT * FROM peraturan ${whereClause} ORDER BY tahun DESC, nomor DESC LIMIT :limit  OFFSET :offset`,
    { ...whereParams, limit, offset },
  );
  const [[total]] = db.query<number[]>(
    `SELECT COUNT(*) FROM peraturan ${whereClause}`,
    whereParams,
  );
  return { total, hasil, page, pageSize };
};

export const getFilterByJenisCount = (
  db: DB,
  params: { jenis?: string; tahun?: string },
) => {
  const { whereClause, whereParams } = buildWhereClause(params);
  return db.queryEntries<{ jenis: string; jumlah: number }>(
    `SELECT jenis, count(*) AS jumlah FROM peraturan ${whereClause} GROUP BY jenis`,
    whereParams,
  );
};

export const getFilterByTahunCount = (
  db: DB,
  params: { jenis?: string; tahun?: string },
) => {
  const { whereClause, whereParams } = buildWhereClause(params);
  return db.queryEntries<{ tahun: number; jumlah: number }>(
    `SELECT tahun, count(*) AS jumlah FROM peraturan ${whereClause} GROUP BY tahun ORDER BY tahun DESC`,
    whereParams,
  );
};

export const getPeraturan = (
  db: DB,
  jenis: string,
  tahun: string,
  nomor: string,
) => {
  const [peraturan] = db.queryEntries<Peraturan>(
    `SELECT * FROM peraturan WHERE jenis = :jenis AND tahun = :tahun AND nomor = :nomor`,
    { jenis, tahun, nomor },
  );
  if (peraturan) return peraturan;
  return null;
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

export const getRelasiPeraturan1 = (
  db: DB,
  jenis: string,
  tahun: string,
  nomor: string,
) => {
  return db.queryEntries<RelasiPeraturan & Peraturan>(
    `SELECT * FROM relasi LEFT JOIN peraturan ON relasi.puu2 = peraturan.jenis || '/' || peraturan.tahun || '/' || peraturan.nomor WHERE puu1 = :key`,
    [`${jenis}/${tahun}/${nomor}`],
  );
};

export const getRelasiPeraturan2 = (
  db: DB,
  jenis: string,
  tahun: string,
  nomor: string,
) => {
  return db.queryEntries<RelasiPeraturan & Peraturan>(
    `SELECT * FROM relasi LEFT JOIN peraturan ON relasi.puu1 = peraturan.jenis || '/' || peraturan.tahun || '/' || peraturan.nomor WHERE puu2 = :key`,
    [`${jenis}/${tahun}/${nomor}`],
  );
};
