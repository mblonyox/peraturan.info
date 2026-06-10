import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DATABASE;
}

export * from "./models/peraturan";
export * from "./models/relasi";
export * from "./models/sumber";
