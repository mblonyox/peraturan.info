import { Buffer } from "node:buffer";
import DB, { type Database } from "better-sqlite3";

import { getDatabaseBytes } from "@/utils/data";

let db: Database | undefined;

export async function getDB() {
  if (!db) {
    const dbBytes = await getDatabaseBytes();
    if (!dbBytes) throw new Error("Database tidak ditemukan.");
    db = new DB(Buffer.from(dbBytes));
  }
  return db;
}

export * from "./models/peraturan";
export * from "./models/relasi";
export * from "./models/sumber";
