import { dirname, fromFileUrl, join } from "$std/path/mod.ts";

const rootPath = join(dirname(fromFileUrl(import.meta.url)), "..");

const getMdFilePath = (jenis: string, tahun: string, nomor: string) =>
  join(rootPath, "data", "markdowns", `${jenis}-${tahun}-${nomor}.md`);

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

export const readTextMd = (
  { jenis, tahun, nomor }: { jenis: string; tahun: string; nomor: string },
) => Deno.readTextFile(getMdFilePath(jenis, tahun, nomor));
