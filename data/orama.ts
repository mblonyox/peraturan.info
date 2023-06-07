import { restoreFromFile } from "@orama/plugin-data-persistence/server";

const schema = {
  path: "string",
  jenis: "string",
  tahun: "number",
  nomor: "string",
  judul: "string",
  tanggal: "number",
  teks: "string",
} as const;

export type Schema = typeof schema;

export function getOrama() {
  return restoreFromFile<Schema>("dpack", "data/index.dpack", "deno");
}
