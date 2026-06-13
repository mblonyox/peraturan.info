DELETE FROM total;
INSERT INTO total ( jenis, tahun, jumlah ) SELECT NULL as jenis, NULL as tahun, COUNT(*) as jumlah FROM peraturan;
INSERT INTO total ( jenis, tahun, jumlah ) SELECT jenis, NULL as tahun, COUNT(*) as jumlah FROM peraturan GROUP BY jenis;
INSERT INTO total ( jenis, tahun, jumlah ) SELECT NULL as jenis, tahun, COUNT(*) as jumlah FROM peraturan GROUP BY tahun;
INSERT INTO total ( jenis, tahun, jumlah ) SELECT jenis, tahun, COUNT(*) as jumlah FROM peraturan GROUP BY jenis, tahun;
