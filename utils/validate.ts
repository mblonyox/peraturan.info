import { z } from "zod";

export const $emptyString = z.literal("").transform(() => undefined);

export const $searchParams = z.instanceof(URLSearchParams)
  .transform((u) => Object.fromEntries(u.entries()));

export const $pageLimit = z.object({
  page: z.string()
    .transform(Number)
    .pipe(z.int().min(1))
    .or($emptyString)
    .default(1),
  limit: z.string()
    .transform(Number)
    .pipe(z.int().min(10).max(100))
    .or($emptyString)
    .default(10),
});
