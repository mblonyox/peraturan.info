import { dirname, fromFileUrl, resolve } from "$std/path/mod.ts";
import { DB } from "$sqlite/mod.ts";
import { prepareLocalFile, prepareVirtualFile } from "$mock_file/mod.ts";

const filepath = resolve(
  dirname(fromFileUrl(import.meta.url)),
  "./database.sqlite",
);
let db: DB | undefined;

async function initDB() {
  await prepareLocalFile(filepath);
  prepareVirtualFile(filepath + "-journal");

  return new DB(filepath, { mode: "read" });
}

export async function getDB() {
  if (!db) {
    db = await initDB();
  }
  return db;
}

export async function lastModDB() {
  const info = await Deno.stat(filepath);
  return info.mtime ?? undefined;
}
