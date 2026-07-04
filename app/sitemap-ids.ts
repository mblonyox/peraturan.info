import { getDB, getFilterByJenisCount, getFilterByTahunCount } from "@/lib/db";

interface Options {
  skipDb?: boolean;
}

export async function sitemapsIds(options?: Options) {
  const sitemapsIds: { id: string }[] = [{ id: "root" }];
  if (!options?.skipDb) {
    const db = await getDB();
    const filterByJenis = await getFilterByJenisCount(db, {});
    for (const j of Object.keys(filterByJenis)) {
      const filterByTahun = await getFilterByTahunCount(db, { jenis: j });
      sitemapsIds.push(
        ...Object.keys(filterByTahun).map((t) => ({ id: `${j}-${t}` })),
      );
    }
  }
  return sitemapsIds;
}
