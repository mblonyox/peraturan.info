import { dirname, fromFileUrl, resolve } from "@std/path";
import { prepareLocalFile, prepareVirtualFile } from "$mock_file";
import { DB } from "$sqlite";

const filepath = resolve(
  dirname(fromFileUrl(import.meta.url)),
  "../../data/database.sqlite",
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
