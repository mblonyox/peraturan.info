import { debounce } from "@std/async";
import { getDatabaseBytes } from "~/utils/data.ts";
import { DB as Database } from "$sqlite";

class DB extends Database implements Disposable {
  #debouncedClose = debounce(() => this.close(true), 1_000);

  [Symbol.dispose]() {
    this.#debouncedClose();
  }
}

let db: DB | undefined;

export async function getDB() {
  if (!db) {
    db = new DB(":memory:", { mode: "read" });
    const dbBytes = await getDatabaseBytes();
    if (dbBytes) db.deserialize(dbBytes);
  }
  return db;
}
