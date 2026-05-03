import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { DATA_REPO, LOCAL_DATA_PATH } from "@/lib/constants";

import { parseSrc } from "./github";

interface PeraturanId {
  jenis: string;
  tahun: string | number;
  nomor: string | number;
}

function readOrFetch(path: string): Promise<ArrayBuffer | null>;
function readOrFetch(path: string, text: true): Promise<string | null>;
async function readOrFetch(
  path: string,
  text?: boolean,
): Promise<ArrayBuffer | string | null> {
  const localPath = join(LOCAL_DATA_PATH, path);
  const file = await readFile(localPath).catch(() => null);
  if (file) return text ? file.toString() : file.buffer;
  if (process.env.PRERENDER) return null;
  const url = new URL(path, parseSrc(DATA_REPO));
  const response = await fetch(url.href).catch(() => null);
  if (response?.ok) return text ? response.text() : response.arrayBuffer();
  return null;
}

export async function getDatabaseBytes() {
  const path = "database.sqlite";
  return readOrFetch(path).catch(() => null);
}

export async function getOramaDpackText() {
  const path = "orama.dpack";
  return readOrFetch(path, true).catch(() => null);
}

export async function getPeraturanMarkdown({
  jenis,
  tahun,
  nomor,
}: PeraturanId) {
  const path = [jenis, tahun, nomor, "fulltext.md"].join("/");
  return readOrFetch(path, true).catch(() => null);
}

export async function getPeraturanThumbnail({
  jenis,
  tahun,
  nomor,
}: PeraturanId) {
  const path = [jenis, tahun, nomor, "thumbnail.png"].join("/");
  return readOrFetch(path).catch(() => null);
}
