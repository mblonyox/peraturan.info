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
