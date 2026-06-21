-- Migration number: 0001 	 2026-06-13T06:19:11.709Z
PRAGMA defer_foreign_keys=TRUE;

CREATE TABLE IF NOT EXISTS peraturan (
	jenis VARCHAR(255) NOT NULL,
	tahun INTEGER NOT NULL,
	nomor INTEGER NOT NULL,
	judul TEXT,
	tanggal_ditetapkan DATE,
	tanggal_diundangkan DATE,
	tanggal_berlaku DATE,
	nomor_text VARCHAR(255),
	created_at INTEGER,
	PRIMARY KEY (jenis,tahun,nomor)
);
CREATE INDEX IF NOT EXISTS idx_peraturan_jenis on peraturan(jenis);
CREATE INDEX IF NOT EXISTS idx_peraturan_tahun on peraturan(tahun);

CREATE TABLE IF NOT EXISTS relasi (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	puu1 VARCHAR NOT NULL,
	relasi VARCHAR NOT NULL,
	puu2 VARCHAR NOT NULL,
	catatan TEXT,
	UNIQUE(puu1, relasi, puu2)
);
CREATE INDEX IF NOT EXISTS idx_relasi_puu2 on relasi(puu2);
CREATE INDEX IF NOT EXISTS idx_relasi_puu1 on relasi(puu1);

CREATE TABLE IF NOT EXISTS sumber (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	puu VARCHAR NOT NULL,
	nama TEXT NOT NULL,
	url_page TEXT,
	url_pdf TEXT
);
CREATE INDEX IF NOT EXISTS idx_sumber_puu on sumber(puu);
