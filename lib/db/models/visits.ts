export async function getPopularPuu(db: D1Database, limit = 15) {
  const { results } = await db
    .prepare(
      `SELECT "path", SUM(visits."count") as "count"
       FROM visits
       WHERE "date" >= date('now', '-7 days')
       GROUP BY "path"
       ORDER BY "count" DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<{ path: string; count: number }>();
  return results;
}
