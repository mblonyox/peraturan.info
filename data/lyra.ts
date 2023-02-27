import { dirname, fromFileUrl, resolve } from "$std/path/mod.ts";
import { create, load } from "@lyrasearch/lyra";
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

export async function getLyra() {
  const file = resolve(dirname(fromFileUrl(import.meta.url)), "./index.dpack");
  const data = await Deno.readTextFile(file);
  const lyra = await create({
    edge: true,
    schema,
  });
  const deserialized = dpack.parse(data);
  await load(lyra, deserialized);
  return lyra;
}
