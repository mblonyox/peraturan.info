import { dirname, fromFileUrl, join } from "$std/path/mod.ts";
import { DB } from "$sqlite/mod.ts";
import { prepareLocalFile, prepareVirtualFile } from "$mock_file/mod.ts";

const filepath = join(
  dirname(fromFileUrl(import.meta.url)),
  "./database.sqlite",
);

export async function getDB() {
  await prepareLocalFile(filepath);
  prepareVirtualFile(filepath + "-journal");

  return new DB(filepath, { mode: "read" });
}

export async function lastModDB() {
  const info = await Deno.stat(filepath);
  return info.mtime || new Date();
}
