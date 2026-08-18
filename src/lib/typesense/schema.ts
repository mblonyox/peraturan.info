import type { CollectionCreateSchema } from "typesense";

export const peraturanSchema: CollectionCreateSchema = {
  name: "peraturan",
  fields: [
    { name: "path", type: "string", isPrimary: true },
    { name: "jenis", type: "string", facet: true },
    { name: "tahun", type: "int32", facet: true },
    { name: "nomor", type: "string" },
    { name: "judul", type: "string", locale: "id", stem: true },
    { name: "tanggal", type: "string", sort: true },
  ],
  default_sorting_field: "tanggal",
};

export interface Peraturan {
  path: string;
  jenis: string;
  tahun: number;
  nomor: string;
  judul: string;
  tanggal: string;
}
