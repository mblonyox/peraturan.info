import { DataTypes, Model } from "$denodb/mod.ts";

export class Dokumen extends Model {
  static table = "dokumen";
  static timestamps = true;

  static fields = {
    id: {autoIncrement: true, primaryKey: true, },
    name: {type: DataTypes.STRING, allowNull: false},
    desc: {type: DataTypes.STRING, allowNull: true},
    src: {type: DataTypes.STRING, allowNull: false}
  };
}
