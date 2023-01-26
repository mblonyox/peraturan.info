import { Database, SQLite3Connector } from "$denodb/mod.ts";
import { dirname, fromFileUrl, join } from "$std/path/mod.ts";
import { Peraturan } from "../models/peraturan.ts";

const filepath = join(
  dirname(fromFileUrl(import.meta.url)),
  "./database.sqlite",
);

const connector = new SQLite3Connector({
  filepath,
});

export const db = new Database(connector);

db.link([Peraturan]);
