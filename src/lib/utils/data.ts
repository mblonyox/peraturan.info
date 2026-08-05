import { DATA_URL } from "@/lib/constants";

export function readOrFetch(path: string): Promise<ArrayBuffer | null>;
export function readOrFetch(
  path: string,
  format: "text",
): Promise<string | null>;
export async function readOrFetch(
  path: string,
  format?: "text" | "binary",
): Promise<ArrayBuffer | string | null> {
  const url = new URL(path, DATA_URL);
  const response = await fetch(url.href)
    .then((response) => {
      if (response.ok) return response;
      if (response.status === 404) return;
      throw new Error("Response not OK: " + response.statusText);
    })
    .catch((error) => console.error(error));
  if (response)
    return format === "text" ? response.text() : response.arrayBuffer();
  return null;
}
