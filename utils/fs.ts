import { dirname, fromFileUrl, join } from "$std/path/mod.ts";

export const rootPath = join(dirname(fromFileUrl(import.meta.url)), "..");

const getMdFilePath = (
  jenis: string,
  tahun: string | number,
  nomor: string | number,
) => join(rootPath, "data", "markdowns", `${jenis}-${tahun}-${nomor}.md`);

export const existsMd = async (
  { jenis, tahun, nomor }: { jenis: string; tahun: string; nomor: string },
) => {
  try {
    const stat = await Deno.stat(getMdFilePath(jenis, tahun, nomor));
    return stat.isFile;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
};

export const readTextMd = async (
  { jenis, tahun, nomor }: {
    jenis: string;
    tahun: string | number;
    nomor: string | number;
  },
) => {
  try {
    return await Deno.readTextFile(getMdFilePath(jenis, tahun, nomor));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
};

export const lastModMd = async (
  { jenis, tahun, nomor }: {
    jenis: string;
    tahun: string | number;
    nomor: string | number;
  },
) => {
  const stat = await Deno.stat(getMdFilePath(jenis, tahun, nomor));
  return stat.mtime ?? undefined;
};
