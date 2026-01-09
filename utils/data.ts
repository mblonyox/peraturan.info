interface PeraturanId {
  jenis: string;
  tahun: string | number;
  nomor: string | number;
}

async function cachedFetch(url: string | URL | Request) {
  const cache = await caches.open("data");
  const cachedResponse = await cache.match(url);
  if (cachedResponse) return cachedResponse;
  const response = await fetch(url);
  await cache.put(url, response.clone());
  return response;
}

export async function getDatabaseBytes() {
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = dataUrl + "/database.sqlite";
    const response = await cachedFetch(url);
    if (!response.ok) throw new Error("Failed to fetch database.sqlite");
    return response.bytes();
  } catch {
    return null;
  }
}

export async function getOramaDpackText() {
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = dataUrl + "/orama.dpack";
    const response = await cachedFetch(url);
    if (!response.ok) throw new Error("Failed to fetch orama.dpack");
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
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = [dataUrl, jenis, tahun, nomor, "fulltext.md"].join("/");
    const response = await cachedFetch(url);
    if (!response.ok) throw new Error("Failed to fetch fulltext.md");
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
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = [dataUrl, jenis, tahun, nomor, "thumbnail.png"].join("/");
    const response = await cachedFetch(url);
    if (!response.ok) throw new Error("Failed to fetch thumbnail.png");
    return response.bytes();
  } catch {
    return null;
  }
}
