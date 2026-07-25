import { z } from "zod";

export const $searchParams = z
  .custom<URLSearchParams>()
  .transform((params) => Object.fromEntries(params.entries()));

export const $pageLimit = z.object({
  page: z.coerce.number<string>().int().positive().default(1),
  limit: z.coerce.number<string>().int().min(10).max(100).default(10),
});
