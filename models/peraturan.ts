import { DB } from "$sqlite/mod.ts";

export const JENIS2_PERATURAN = [
  "uu",
  "perppu",
  "pp",
  "perpres",
  "permenkeu",
] as const;

export type JenisPeraturan = typeof JENIS2_PERATURAN[number];

export const NAMA2_JENIS: Record<
  JenisPeraturan | string,
  { pendek: string; panjang: string }
> = {
  "uu": { pendek: "UU", panjang: "Undang-Undang" },
  "perppu": {
    pendek: "Perpu",
    panjang: "Peraturan Pemerintah Penganti Undang-undang",
  },
  "pp": { pendek: "PP", panjang: "Peraturan Pemerintah" },
  "perpres": { pendek: "Perpres", panjang: "Peraturan Presiden" },
  "permenkeu": { pendek: "PMK", panjang: "Peraturan Menteri Keuangan" },
};

export type PeraturanRow = {
  jenis: string;
  tahun: string;
  nomor: string;
  judul: string;
  tanggal_ditetapkan: string;
  tanggal_diundangkan: string;
  tanggal_berlaku: string;
  nomor_text: string;
};

export class Peraturan {
  jenis: JenisPeraturan;
  tahun: number;
  nomor: number;
  judul: string;
  tanggal_ditetapkan: Date;
  tanggal_diundangkan: Date;
  tanggal_berlaku: Date;
  nomor_text: string;

  constructor(
    {
      jenis,
      tahun,
      nomor,
      judul,
      tanggal_ditetapkan,
      tanggal_diundangkan,
      tanggal_berlaku,
      nomor_text,
    }: PeraturanRow,
  ) {
    this.jenis = jenis as JenisPeraturan;
    this.tahun = parseInt(tahun);
    this.nomor = parseInt(nomor);
    this.judul = judul;
    this.tanggal_ditetapkan = new Date(tanggal_ditetapkan);
    this.tanggal_diundangkan = new Date(tanggal_diundangkan);
    this.tanggal_berlaku = new Date(tanggal_berlaku);
    this.nomor_text = nomor_text;
  }

  get path() {
    return `/${this.jenis}/${this.tahun}/${this.nomor}`;
  }

  get breadcrumbs() {
    return [
      { name: this.namaJenisPanjang, url: `/${this.jenis}` },
      { name: this.tahun.toString(), url: `/${this.jenis}/${this.tahun}` },
      { name: this.nomorPendek, url: this.path },
    ];
  }

  get namaJenisPendek() {
    return NAMA2_JENIS[this.jenis].pendek;
  }

  get namaJenisPanjang() {
    return NAMA2_JENIS[this.jenis].panjang;
  }

  get nomorPendek() {
    return "No.\xa0" +
      (this.nomor_text || `${this.nomor}\xa0Th.\xa0${this.tahun}`);
  }

  get nomorPanjang() {
    return "Nomor " + (this.nomor_text ||
      `${this.nomor} Tahun ${this.tahun}`);
  }

  get rujukPendek() {
    return `${this.namaJenisPanjang} ${this.nomorPanjang}`;
  }

  get rujukPanjang() {
    return `${this.namaJenisPanjang} ${this.nomorPanjang} tentang ${this.judul}`;
  }
}

export type PuuRef = `${JenisPeraturan}/${number}/${number}`;

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
  const rows = db.queryEntries<PeraturanRow>(
    `SELECT * FROM peraturan ${whereClause} ORDER BY tahun DESC, nomor DESC LIMIT :limit  OFFSET :offset`,
    { ...whereParams, limit, offset },
  );
  const hasil = rows.map((row) => new Peraturan(row));
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
  const [row] = db.queryEntries<PeraturanRow>(
    `SELECT * FROM peraturan WHERE jenis = :jenis AND tahun = :tahun AND nomor = :nomor`,
    { jenis, tahun, nomor },
  );
  if (row) return new Peraturan(row);
  return null;
};
