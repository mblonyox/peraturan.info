import { dirname, fromFileUrl, resolve } from "$std/path/mod.ts";
import { create, load, Orama } from "@orama/orama";
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

const filepath = resolve(
  dirname(fromFileUrl(import.meta.url)),
  "../../data/orama.dpack",
);
let orama: Orama<Schema> | undefined;

async function loadOrama() {
  const data = await Deno.readTextFile(filepath);
  const orama = await create({
    schema,
  });
  const deserialized = dpack.parse(data);
  await load(orama, deserialized);
  return orama;
}

export async function getOrama() {
  if (!orama) {
    orama = await loadOrama();
  }
  return orama;
}
