import { create, load, type RawData } from "@orama/orama";
import * as dpack from "dpack";

import { readOrFetch } from "@/utils/data";

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

export async function getOrama() {
  const orama = await create({ schema });
  const data = await readOrFetch("orama.dpack", "text");
  if (!data) throw new Error("Orama data tidak ditemukan.");
  const deserialized = dpack.parse(data) as RawData;
  await load(orama, deserialized);
  return orama;
}
