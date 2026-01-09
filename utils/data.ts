interface PeraturanId {
  jenis: string;
  tahun: string | number;
  nomor: string | number;
}

async function cachedFetch(url: string | URL | Request) {
  const cache = await caches.open("data");
  let response = await cache.match(url);
  if (!response) {
    response = await fetch(url);
    await cache.put(url, response.clone());
  }
  if (!response.ok) throw new Error("Failed to fetch " + url);
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
