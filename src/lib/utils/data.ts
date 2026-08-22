import { DATA_URL } from "@/lib/constants";

interface Options {
  format?: "text" | "binary";
  cache?: RequestCache;
}

export function getData(
  path: string,
  options: { format: "text"; cache?: RequestCache },
): Promise<string | null>;
export function getData(
  path: string,
  options?: { format?: "binary"; cache?: RequestCache },
): Promise<ArrayBuffer | null>;
export async function getData(path: string, options?: Options) {
  const url = new URL(path, DATA_URL);
  const response = await fetch(url.href, { cache: options?.cache })
    .then((response) => {
      if (response.ok) return response;
      if (response.status === 404) return;
      throw new Error("Response not OK: " + response.statusText);
    })
    .catch((error) => console.error(error));
  if (response)
    return options?.format === "text"
      ? response.text()
      : response.arrayBuffer();
  return null;
}
