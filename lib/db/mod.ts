import { getDatabaseBytes } from "~/utils/data.ts";
import { DB } from "$sqlite";

let db: DB | undefined;

export async function getDB() {
  if (!db) {
    db = new DB(":memory:", { mode: "read" });
    const dbBytes = await getDatabaseBytes();
    if (dbBytes) db.deserialize(dbBytes);
  }
  return db;
}
