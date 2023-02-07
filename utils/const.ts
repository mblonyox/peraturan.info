export const SEO_TITLE = "Peraturan.deno.dev";
export const SEO_DESCRIPTION =
  "Peraturan.deno.dev adalah upaya untuk meningkatkan " +
  "cara penyajian peraturan perundang-undangan di Indonesia sehingga lebih " +
  "user-friendly yang terinspirasi dari legislation.gov.uk.";

export const JENIS_PERATURAN: {
  kode: string;
  nama: string;
  singkatan?: string;
}[] = [
  { kode: "uu", nama: "Undang\u2011Undang" },
  {
    kode: "perppu",
    nama: "Peraturan Pemerintah Pengganti Undang-undang",
    singkatan: "Perppu",
  },
  { kode: "pp", nama: "Peraturan Pemerintah" },
  { kode: "perpres", nama: "Peraturan Presiden" },
  { kode: "permenkeu", nama: "Peraturan Menteri Keuangan" },
];

export const getNamaJenis = (kode: string) =>
  JENIS_PERATURAN.find((jenis) => jenis.kode === kode)?.nama;
