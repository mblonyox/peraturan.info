import { create, load, type Orama, type RawData } from "@orama/orama";

import { getOramaDpackText } from "~/utils/data.ts";
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

let orama: Orama<Schema> | undefined;

export async function getOrama() {
  if (!orama) {
    orama = await create({ schema });
    const data = await getOramaDpackText();
    if (data) {
      const deserialized = dpack.parse(data) as RawData;
      await load(orama, deserialized);
    }
    return orama;
  }
  return orama;
}
