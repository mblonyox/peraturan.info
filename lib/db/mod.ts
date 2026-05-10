import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { debounce } from "@std/async";

export class DB extends DatabaseSync {
  static db: DB | undefined;

  #debouncedDispose = debounce(() => {
    super[Symbol.dispose]();
    DB.db = undefined;
  }, 500);

  constructor() {
    if (DB.db) {
      DB.db.#debouncedDispose.clear();
      return DB.db;
    }
    super("database.sqlite", { readOnly: true });
    DB.db = this;
  }

  override [Symbol.dispose]() {
    this.#debouncedDispose();
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
