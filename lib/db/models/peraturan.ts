export const JENIS2_PERATURAN = [
  "uu",
  "perppu",
  "pp",
  "perpres",
  "permenkeu",
] as const;

export type JenisPeraturan = (typeof JENIS2_PERATURAN)[number];

export const NAMA2_JENIS: Record<
  JenisPeraturan | string,
  { pendek: string; panjang: string }
> = {
  uu: { pendek: "UU", panjang: "Undang-Undang" },
  perppu: {
    pendek: "Perpu",
    panjang: "Peraturan Pemerintah Penganti Undang-undang",
  },
  pp: { pendek: "PP", panjang: "Peraturan Pemerintah" },
  perpres: { pendek: "Perpres", panjang: "Peraturan Presiden" },
  permenkeu: { pendek: "PMK", panjang: "Peraturan Menteri Keuangan" },
};

export interface PeraturanRow {
  jenis: string;
  tahun: string;
  nomor: string;
  judul: string;
  tanggal_ditetapkan: string;
  tanggal_diundangkan: string;
  tanggal_berlaku: string;
  nomor_text: string;
  created_at: string;
}

export class Peraturan {
  jenis: JenisPeraturan;
  tahun: number;
  nomor: number;
  judul: string;
  tanggal_ditetapkan: Date;
  tanggal_diundangkan: Date;
  tanggal_berlaku: Date;
  nomor_text: string;
  created_at: Date;

  constructor({
    jenis,
    tahun,
    nomor,
    judul,
    tanggal_ditetapkan,
    tanggal_diundangkan,
    tanggal_berlaku,
    nomor_text,
    created_at,
  }: PeraturanRow) {
    this.jenis = jenis as JenisPeraturan;
    this.tahun = parseInt(tahun);
    this.nomor = parseInt(nomor);
    this.judul = judul;
    this.tanggal_ditetapkan = new Date(tanggal_ditetapkan);
    this.tanggal_diundangkan = new Date(tanggal_diundangkan);
    this.tanggal_berlaku = new Date(tanggal_berlaku);
    this.nomor_text = nomor_text;
    this.created_at = new Date(parseInt(created_at) * 1000);
  }

  static fromRow(row: Record<string, unknown>) {
    return new Peraturan(row as unknown as PeraturanRow);
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
    return (
      "No.\xa0" + (this.nomor_text || `${this.nomor}\xa0Th.\xa0${this.tahun}`)
    );
  }

  get nomorPanjang() {
    return "Nomor " + (this.nomor_text || `${this.nomor} Tahun ${this.tahun}`);
  }

  get rujukPendek() {
    return `${this.namaJenisPanjang} ${this.nomorPanjang}`;
  }

  get rujukPanjang() {
    return `${this.namaJenisPanjang} ${this.nomorPanjang} tentang ${this.judul}`;
  }
}

export type PuuRef = `${JenisPeraturan}/${number}/${number}`;

export async function getListPeraturan(
  db: D1Database,
  {
    jenis,
    tahun,
    page = 1,
    pageSize = 10,
  }: {
    jenis?: string;
    tahun?: string;
    page?: number;
    pageSize?: number;
  },
) {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const conditions: string[] = [];
  const params: string[] = [];
  if (jenis) {
    conditions.push("jenis = ?");
    params.push(jenis);
  }
  if (tahun) {
    conditions.push("tahun = ?");
    params.push(tahun);
  }

  const hasil = await db
    .prepare(
      `SELECT *
       FROM peraturan
       ${conditions.length ? "WHERE " + conditions.join(" AND ") : ""}
       ORDER BY jenis DESC, tahun DESC, nomor DESC
       LIMIT ?
       OFFSET ?`,
    )
    .bind(...params, limit, offset)
    .all()
    .then((result) => result.results.map((row) => Peraturan.fromRow(row)));
  const total = await db
    .prepare(
      `SELECT jumlah
       FROM total
       WHERE (?1 IS NULL AND jenis IS NULL OR jenis = ?1)
         AND (?2 IS NULL AND tahun IS NULL OR tahun = ?2)`,
    )
    .bind(jenis ?? null, tahun ?? null)
    .first();
  return { total: (total?.jumlah ?? 0) as number, hasil, page, pageSize };
}

export async function getFilterByJenisCount(
  db: D1Database,
  { jenis, tahun }: { jenis?: string; tahun?: string },
) {
  const { results } = await db
    .prepare(
      `SELECT jenis, jumlah
       FROM total
       WHERE (?1 IS NULL OR jenis = ?1)
         AND (?2 IS NULL AND tahun IS NULL OR tahun = ?2)`,
    )
    .bind(jenis ?? null, tahun ?? null)
    .all();

  return Object.fromEntries(
    results
      .filter((v) => !!v.jenis)
      .map((v) => [v.jenis as string, v.jumlah as number]),
  );
}

export async function getFilterByTahunCount(
  db: D1Database,
  { jenis, tahun }: { jenis?: string; tahun?: string },
) {
  const { results } = await db
    .prepare(
      `SELECT tahun, jumlah
       FROM total
       WHERE (?1 IS NULL AND jenis IS NULL OR jenis = ?1)
         AND (?2 IS NULL OR tahun = ?2)`,
    )
    .bind(jenis ?? null, tahun ?? null)
    .all();

  return Object.fromEntries(
    results
      .filter((v) => !!v.tahun)
      .map((v) => [v.tahun as string, v.jumlah as number]),
  );
}

export interface PeraturanParams {
  jenis: string;
  tahun: string;
  nomor: string;
}

export async function getPeraturan(
  db: D1Database,
  { jenis, tahun, nomor }: PeraturanParams,
) {
  const row = await db
    .prepare(
      `SELECT * FROM peraturan WHERE jenis = ? AND tahun = ? AND nomor = ?`,
    )
    .bind(jenis, tahun, nomor)
    .first();
  if (row) return Peraturan.fromRow(row);
  return null;
}

export async function getTanggalTerakhir(db: D1Database) {
  const { results } = await db
    .prepare(
      `SELECT tanggal_diundangkan tanggal, count() jumlah
       FROM peraturan
       GROUP BY tanggal_diundangkan
       ORDER BY tanggal_diundangkan DESC
       LIMIT 5`,
    )
    .all();
  return results as { tanggal: string; jumlah: number }[];
}

export async function getListPeraturanByTanggal(
  db: D1Database,
  tanggal: string,
) {
  const { results } = await db
    .prepare(
      `SELECT *
       FROM peraturan
       WHERE tanggal_diundangkan = ?`,
    )
    .bind(tanggal)
    .all();
  return results.map((row) => Peraturan.fromRow(row));
}

export async function getFeedListPeraturan(db: D1Database) {
  const { results } = await db
    .prepare(
      `SELECT *
       FROM peraturan
       ORDER BY tanggal_diundangkan DESC
       LIMIT 15`,
    )
    .all();
  return results.map((row) => Peraturan.fromRow(row));
}
