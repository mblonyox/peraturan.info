"use server";

import { notFound } from "next/navigation";
import { cache } from "react";

import {
  getDB,
  getListPeraturan,
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  getSumberPeraturan,
  type PeraturanParams,
} from "@/lib/db";
import { getPeraturanMarkdown, getPeraturanThumbnail } from "@/utils/data";

export const getPeraturanData = cache(async (params: PeraturanParams) => {
  const db = await getDB();
  const peraturan = getPeraturan(db, params);
  if (!peraturan) notFound();
  const md = await getPeraturanMarkdown(params);
  const thumbnail = await getPeraturanThumbnail(params);
  return { peraturan, md, thumbnail };
});

export const getRelasiData = cache(async (params: PeraturanParams) => {
  const db = await getDB();
  const sumber = getSumberPeraturan(db, params);
  const relasi1 = getRelasiPeraturan1(db, params);
  const relasi2 = getRelasiPeraturan2(db, params);
  return { sumber, relasi1, relasi2 };
});

export const generateStaticParams = async () => {
  const db = await getDB();
  const list = getListPeraturan(db, { pageSize: 1e4 });
  return list.hasil.map((item) => ({
    jenis: item.jenis,
    tahun: item.tahun.toString(),
    nomor: item.nomor.toString(),
  }));
};

export type { Peraturan } from "@/lib/db";
