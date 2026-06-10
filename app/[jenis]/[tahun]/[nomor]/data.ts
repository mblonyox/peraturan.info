"use server";

import { notFound } from "next/navigation";
import { cache } from "react";

import {
  getDB,
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  getSumberPeraturan,
  type PeraturanParams,
} from "@/lib/db";
import { getPeraturanMarkdown, getPeraturanThumbnail } from "@/utils/data";

export const getPeraturanData = cache(async (params: PeraturanParams) => {
  const db = await getDB();
  const peraturan = await getPeraturan(db, params);
  if (!peraturan) notFound();
  const md = await getPeraturanMarkdown(params);
  const thumbnail = await getPeraturanThumbnail(params);
  return { peraturan, md, thumbnail };
});

export const getRelasiData = cache(async (params: PeraturanParams) => {
  const db = await getDB();
  const sumber = await getSumberPeraturan(db, params);
  const relasi1 = await getRelasiPeraturan1(db, params);
  const relasi2 = await getRelasiPeraturan2(db, params);
  return { sumber, relasi1, relasi2 };
});

export type { Peraturan } from "@/lib/db";
