import { create, load, type Orama, type RawData } from "@orama/orama";
import { resolve } from "@std/path";
// @deno-types="~/dpack.d.ts"
import * as dpack from "dpack";

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

const filepath = resolve(Deno.cwd(), "data/orama.dpack");
let orama: Orama<Schema> | undefined;

async function loadOrama() {
  const data = await Deno.readTextFile(filepath);
  const orama = await create({ schema });
  const deserialized = dpack.parse(data) as RawData;
  await load(orama, deserialized);
  return orama;
}

export async function getOrama() {
  if (!orama) {
    orama = await loadOrama();
  }
  return orama;
}
