import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { debounce } from "@std/async";

let db: DB | undefined;

export function getDB(): DB {
  if (!db) db = new DB();
  return db;
}

export class DB extends DatabaseSync {
  override [Symbol.dispose] = debounce(() => {
    super[Symbol.dispose]();
    db = undefined;
  }, 500);

  constructor() {
    super("database.sqlite", { readOnly: true });
  }

  query<T extends unknown[]>(
    sql: string,
    params?: Record<string, SQLInputValue>,
  ): T[] {
    return this.prepare(sql)
      .all(params ?? {})
      .map((v) => Object.values(v)) as T[];
  }

  queryEntries<T>(
    sql: string,
    params?: Record<string, SQLInputValue>,
  ): T[] {
    return this.prepare(sql).all(params ?? {}) as T[];
  }
}
