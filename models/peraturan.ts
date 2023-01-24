import { DataTypes, Model } from "$denodb/mod.ts";

export class Peraturan extends Model {
  static table = "peraturan";
  static timestamps = true;

  static fields = {
    bentuk: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    unit: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    tahun: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    nomor: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    tanggal: { type: DataTypes.DATE, allowNull: false },
    judul: { type: DataTypes.TEXT, allowNull: false },
    berlakuMulai: { type: DataTypes.DATE, allowNull: false },
    berlakuSelesai: { type: DataTypes.DATE, allowNull: true },
  };
}
