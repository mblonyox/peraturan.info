import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { NodeFetchCache } from "node-fetch-cache";

const fetch = NodeFetchCache.create({
  shouldCacheResponse: (response) => response.ok || response.status === 404,
});

interface PeraturanId {
  jenis: string;
  tahun: string | number;
  nomor: string | number;
}

const DEFAULT_LOCAL_DATA_URL = "../data-peraturan";
const DEFAULT_REMOTE_DATA_URL =
  "https://raw.githubusercontent.com/mblonyox/data-peraturan/refs/heads/main/";

const localDataUrl = process.env.LOCAL_DATA_URL ?? DEFAULT_LOCAL_DATA_URL;
const remoteDataUrl = process.env.REMOTE_DATA_URL ?? DEFAULT_REMOTE_DATA_URL;

function readOrFetch(path: string): Promise<ArrayBuffer | null>;
function readOrFetch(path: string, text: true): Promise<string | null>;
async function readOrFetch(
  path: string,
  text?: boolean,
): Promise<ArrayBuffer | string | null> {
  const localPath = join(localDataUrl, path);
  const file = await readFile(localPath).catch(() => null);
  if (file) return text ? file.toString() : file.buffer;
  const url = new URL(path, remoteDataUrl);
  const response = await fetch(url);
  if (response.ok) return text ? response.text() : response.arrayBuffer();
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
