interface PeraturanId {
  jenis: string;
  tahun: string | number;
  nomor: string | number;
}

const notFounds = new Set<string | URL | Request>();

async function cachedFetch(url: string | URL | Request) {
  if (notFounds.has(url)) throw new Error("Not found");
  const cache = await caches.open("data");
  const cachedResponse = await cache.match(url);
  if (cachedResponse) return cachedResponse;
  const response = await fetch(url);
  if (!response.ok) {
    notFounds.add(url);
    throw new Error("Failed to fetch " + url);
  }
  await cache.put(url, response.clone());
  return response;
}

export async function getDatabaseBytes() {
  const dataUrl = Deno.env.get("DATA_URL");
  if (!dataUrl) return null;
  const url = dataUrl + "/database.sqlite";
  try {
    const response = await cachedFetch(url);
    return response.bytes();
  } catch {
    return null;
  }
}

export async function getOramaDpackText() {
  const dataUrl = Deno.env.get("DATA_URL");
  if (!dataUrl) return null;
  const url = dataUrl + "/orama.dpack";
  try {
    const response = await cachedFetch(url);
    return response.text();
  } catch {
    return null;
  }
}

export async function getPeraturanMarkdown({
  jenis,
  tahun,
  nomor,
}: PeraturanId) {
  const dataUrl = Deno.env.get("DATA_URL");
  if (!dataUrl) return null;
  const url = [dataUrl, jenis, tahun, nomor, "fulltext.md"].join("/");
  try {
    const response = await cachedFetch(url);
    return response.text();
  } catch {
    return null;
  }
}

export async function getPeraturanThumbnail({
  jenis,
  tahun,
  nomor,
}: PeraturanId) {
  const dataUrl = Deno.env.get("DATA_URL");
  if (!dataUrl) return null;
  const url = [dataUrl, jenis, tahun, nomor, "thumbnail.png"].join("/");
  try {
    const response = await cachedFetch(url);
    return response.bytes();
  } catch {
    return null;
  }
}
