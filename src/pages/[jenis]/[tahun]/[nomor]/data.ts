"use server";

import {
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  getSumberPeraturan,
  type PeraturanParams,
} from "@/lib/db";
import { readOrFetch } from "@/lib/utils/data";

export const getPeraturanData = async (params: PeraturanParams) => {
  const peraturan = await getPeraturan(params);
  return peraturan;
};

export const getPeraturanMarkdown = async ({
  jenis,
  tahun,
  nomor,
}: PeraturanParams) => {
  const path = `${jenis}/${tahun}/${nomor}/fulltext.md`;
  return readOrFetch(path, "text");
};

export const getPeraturanThumbnail = async ({
  jenis,
  tahun,
  nomor,
}: PeraturanParams) => {
  const path = `${jenis}/${tahun}/${nomor}/thumbnail.png`;
  return readOrFetch(path);
};

export const getRelasiData = async (params: PeraturanParams) => {
  const sumber = await getSumberPeraturan(params);
  const relasi1 = await getRelasiPeraturan1(params);
  const relasi2 = await getRelasiPeraturan2(params);
  return { sumber, relasi1, relasi2 };
};

export type { Peraturan } from "@/lib/db";
