-- Migration number: 0002 	 2026-06-13T07:06:26.322Z
CREATE TABLE total (
  jenis VARCHAR(255),
  tahun INTEGER,
  jumlah INTEGER,

  PRIMARY KEY (jenis, tahun) ON CONFLICT REPLACE
);