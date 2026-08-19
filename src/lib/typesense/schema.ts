import type { CollectionCreateSchema } from "typesense";
import { z } from "zod";

export const peraturanCollectionSchema: CollectionCreateSchema = {
  name: "peraturan",
  fields: [
    { name: "id", type: "string" },
    { name: "path", type: "string" },
    { name: "jenis", type: "string", facet: true },
    { name: "tahun", type: "int32", facet: true },
    { name: "nomor", type: "string" },
    { name: "judul", type: "string", locale: "id", stem: true },
    { name: "tanggal", type: "string", sort: true },
  ],
  default_sorting_field: "tanggal",
};

export const peraturanDocumentSchema = z
  .object({
    path: z.string(),
    jenis: z.string(),
    tahun: z.number(),
    nomor: z.string(),
    judul: z.string(),
    tanggal: z.string(),
  })
  .transform((data) => ({
    id: data.path
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .replaceAll("/", "_"),
    ...data,
  }));

export type PeraturanDocument = z.infer<typeof peraturanDocumentSchema>;
