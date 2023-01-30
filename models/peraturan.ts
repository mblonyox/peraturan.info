import { DB } from "$sqlite/mod.ts";

export interface Peraturan {
  [x: string]: unknown;
  jenis: string;
  tahun: number;
  nomor: number;
  judul: string;
  tanggal_ditetapkan: Date;
  tanggal_diundangkan: Date;
  tanggal_berlaku: Date;
}

export const listPeraturan = (db: DB, {
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
  const conditions = [];
  const params: { jenis?: string; tahun?: string } = {};
  if (jenis) {
    conditions.push("jenis = :jenis");
    params.jenis = jenis;
  }
  if (tahun) {
    conditions.push("tahun = :tahun");
    params.tahun = tahun;
  }
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const filterByJenis = db.queryEntries<{ jenis: string; jumlah: number }>(
    `SELECT jenis, count(*) AS jumlah FROM peraturan ${whereClause} GROUP BY jenis`,
    params,
  );
  const filterByTahun = db.queryEntries<{ tahun: number; jumlah: number }>(
    `SELECT tahun, count(*) AS jumlah FROM peraturan ${whereClause} GROUP BY tahun ORDER BY tahun DESC`,
    params,
  );

  const page = pageParam ?? 1;
  const pageSize = pageSizeParam ?? 10;
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const hasil = db.queryEntries<Peraturan>(
    `SELECT * FROM peraturan ${whereClause} ORDER BY tahun DESC, nomor DESC LIMIT :limit  OFFSET :offset`,
    { ...params, limit, offset },
  );
  const [[total]] = db.query<number[]>(
    `SELECT COUNT(*) FROM peraturan ${whereClause}`,
    params,
  );
  return { total, hasil, page, pageSize, filterByJenis, filterByTahun };
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
  return db.queryEntries<
    { nama: string; url_page: string; url_pdf: string }
  >(
    `SELECT nama, url_page, url_pdf FROM sumber WHERE jenis_tahun_nomor = :key`,
    [`${jenis}/${tahun}/${nomor}`],
  );
};
