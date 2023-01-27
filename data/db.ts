import { dirname, fromFileUrl, join } from "$std/path/mod.ts";
import { DB } from "$sqlite/mod.ts";
import { prepareLocalFile, prepareVirtualFile } from "$mock_file/mod.ts";
const filepath = join(
  dirname(fromFileUrl(import.meta.url)),
  "./database.sqlite",
);

await prepareLocalFile(filepath);
prepareVirtualFile(filepath + "-journal");

export const db = new DB(filepath, { mode: "read" });
