import { dirname, fromFileUrl, join } from "$std/path/mod.ts";
import { DB } from "$sqlite/mod.ts";

const filepath = join(
  dirname(fromFileUrl(import.meta.url)),
  "./database.sqlite",
);

export const db = new DB(filepath, { mode: "read" });
