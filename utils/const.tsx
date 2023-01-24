export const BENTUK_PERATURAN: {
  kode: string;
  nama: string;
  singkatan?: string;
}[] = [
  { kode: "uu", nama: "Undang-undang" },
  {
    kode: "perppu",
    nama: "Peraturan Pemerintah Pengganti Undang-undang",
    singkatan: "Perppu",
  },
  { kode: "pp", nama: "Peraturan Pemerintah" },
  { kode: "perpres", nama: "Peraturan Presiden" },
  { kode: "permen", nama: "Peraturan Menteri" },
  {
    kode: "perlembaga",
    nama: "Peraturan Lembaga Non Kementerian",
    singkatan: "Peraturan Lembaga",
  },
  { kode: "perda", nama: "Peraturan Daerah" },
];
