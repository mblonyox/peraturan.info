"use server";

import { cache } from "react";

import {
  getDB,
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  getSumberPeraturan,
  type PeraturanParams,
} from "@/lib/db";
import { readOrFetch } from "@/utils/data";

export const getPeraturanData = cache(async (params: PeraturanParams) => {
  const db = await getDB();
  const peraturan = await getPeraturan(db, params);
  return peraturan;
});

export const getPeraturanMarkdown = cache(
  async ({ jenis, tahun, nomor }: PeraturanParams) => {
    const path = `${jenis}/${tahun}/${nomor}/fulltext.md`;
    return readOrFetch(path, "text");
  },
);

export const getPeraturanThumbnail = cache(
  async ({ jenis, tahun, nomor }: PeraturanParams) => {
    const path = `${jenis}/${tahun}/${nomor}/thumbnail.png`;
    return readOrFetch(path);
  },
);

export const getRelasiData = cache(async (params: PeraturanParams) => {
  const db = await getDB();
  const sumber = await getSumberPeraturan(db, params);
  const relasi1 = await getRelasiPeraturan1(db, params);
  const relasi2 = await getRelasiPeraturan2(db, params);
  return { sumber, relasi1, relasi2 };
});

export type { Peraturan } from "@/lib/db";
