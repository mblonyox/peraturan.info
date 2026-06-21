import { DurableObject } from "cloudflare:workers";

export class DOVisitCounter extends DurableObject {
  async visit(path: string): Promise<void> {
    let value = await this.ctx.storage.get<number>(path);
    value = (value || 0) + 1;
    await this.ctx.storage.put(path, value);

    const currentAlarm = await this.ctx.storage.getAlarm();
    if (currentAlarm == null) {
      this.ctx.storage.setAlarm(Date.now() + 1000 * 30);
    }
  }

  async alarm(): Promise<void> {
    const data = await this.ctx.storage.list<number>();
    const stmt = this.env.DATABASE.prepare(
      `INSERT INTO visits ("path", "date", "count") VALUES (?, ?, ?) ON CONFLICT ("path", "date") DO UPDATE SET "count" = "count" + excluded."count"`,
    );
    const date = new Date().toISOString().slice(0, 10);
    await this.env.DATABASE.batch(
      [...data.entries()].map(([path, count]) => stmt.bind(path, date, count)),
    );
    await this.ctx.storage.deleteAll();
  }
}
