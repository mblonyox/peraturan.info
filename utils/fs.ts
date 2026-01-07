import { exists } from "@std/fs";
import { resolve } from "@std/path";

interface PeraturanId {
  jenis: string;
  tahun: string | number;
  nomor: string | number;
}

const getMdFilePath = ({ jenis, tahun, nomor }: PeraturanId) =>
  resolve(Deno.cwd(), `data/${jenis}/${tahun}/${nomor}/fulltext.md`);

const getThumbnailFilePath = ({ jenis, tahun, nomor }: PeraturanId) =>
  resolve(Deno.cwd(), `data/${jenis}/${tahun}/${nomor}/thumbnail.png`);

export const existsMd = (pId: PeraturanId) => exists(getMdFilePath(pId));

export const readTextMd = (pId: PeraturanId) =>
  Deno.readTextFile(getMdFilePath(pId));

export const lastModMd = async (pId: PeraturanId) => {
  const stat = await Deno.stat(getMdFilePath(pId));
  return stat.mtime ?? undefined;
};

export const existsThumbnail = (pId: PeraturanId) =>
  exists(getThumbnailFilePath(pId));

export const readThumbnail = (pId: PeraturanId) =>
  Deno.readFile(getThumbnailFilePath(pId));
