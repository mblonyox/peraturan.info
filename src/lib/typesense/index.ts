import { env } from "cloudflare:workers";
import { Client } from "typesense";

export function createClient() {
  return new Client({
    apiKey: env.TYPESENSE_API_KEY,
    nodes: [{ url: env.TYPESENSE_URL }],
  });
}

export * from "./schema";
