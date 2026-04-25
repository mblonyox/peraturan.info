import { DB } from "@mainframe-api/deno-sqlite";

import { getDatabaseBytes } from "@/utils/data";

let db: DB | undefined;

export async function getDB() {
  if (!db) {
    const dbBytes = await getDatabaseBytes();
    if (!dbBytes) throw new Error("Database tidak ditemukan.");
    db = new DB();
    db.deserialize(dbBytes, { mode: "read" });
  }
  return db;
}

export * from "./models/peraturan";
export * from "./models/relasi";
export * from "./models/sumber";
