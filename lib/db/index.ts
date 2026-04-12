import { getDatabaseBytes } from "@/utils/data";
import DB, { type Database } from "better-sqlite3";

let db: Database | undefined;

export async function getDB() {
  if (!db) {
    const dbBytes = await getDatabaseBytes();
    db = new DB(dbBytes as Buffer);
  }
  return db;
}

export * from "./models/peraturan";
export * from "./models/relasi";
export * from "./models/sumber";
