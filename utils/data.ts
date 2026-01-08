interface PeraturanId {
  jenis: string;
  tahun: string | number;
  nomor: string | number;
}

export const getDatabaseBytes = async () => {
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = dataUrl + "/database.sqlite";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch database.sqlite");
    return response.bytes();
  } catch {
    return null;
  }
};

export const getOramaDpackText = async () => {
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = dataUrl + "/orama.dpack";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch orama.dpack");
    return response.text();
  } catch {
    return null;
  }
};

export const getPeraturanMarkdown = async ({
  jenis,
  tahun,
  nomor,
}: PeraturanId) => {
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = [dataUrl, jenis, tahun, nomor, "fulltext.md"].join("/");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch fulltext.md");
    return response.text();
  } catch {
    return null;
  }
};

export const getPeraturanThumbnail = async ({
  jenis,
  tahun,
  nomor,
}: PeraturanId) => {
  try {
    const dataUrl = Deno.env.get("DATA_URL");
    if (!dataUrl) throw new Error("DATA_URL not found");
    const url = [dataUrl, jenis, tahun, nomor, "thumbnail.png"].join("/");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch thumbnail.png");
    return response.bytes();
  } catch {
    return null;
  }
};
