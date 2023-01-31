import { dirname, fromFileUrl, join } from "$std/path/mod.ts";
import { DB } from "$sqlite/mod.ts";
import { prepareLocalFile, prepareVirtualFile } from "$mock_file/mod.ts";

export async function getDB() {
  const filepath = join(
    dirname(fromFileUrl(import.meta.url)),
    "./database.sqlite",
  );

  await prepareLocalFile(filepath);
  prepareVirtualFile(filepath + "-journal");

  return new DB(filepath, { mode: "read" });
}
