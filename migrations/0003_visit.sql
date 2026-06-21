-- Migration number: 0003 	 2026-06-21T17:20:29.760Z
CREATE TABLE IF NOT EXISTS visits (
  "path" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("path", "date")
);

CREATE INDEX IF NOT EXISTS visits_date_idx ON visits ("date");
