import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { DATA_REPO, LOCAL_DATA_PATH } from "@/lib/constants";

import { parseSrc } from "./github";

const repoBaseUrl = parseSrc(DATA_REPO);

export function readOrFetch(path: string): Promise<ArrayBuffer | null>;
export function readOrFetch(
  path: string,
  format: "text",
): Promise<string | null>;
export async function readOrFetch(
  path: string,
  format?: "text" | "binary",
): Promise<ArrayBuffer | string | null> {
  const localPath = join(LOCAL_DATA_PATH, path);
  const file = await readFile(localPath).catch(() => null);
  if (file) return format === "text" ? file.toString() : file.buffer;
  const url = new URL(path, repoBaseUrl);
  const response = await fetch(url.href, { cache: "force-cache" })
    .then((r) => (r.ok ? r : null))
    .catch(() => null);
  if (response)
    return format === "text" ? response.text() : response.arrayBuffer();
  return null;
}
