import type { State } from "~/utils/define.ts";
import { App, staticFiles, trailingSlashes } from "fresh";

export const app = new App<State>()
  .use(staticFiles())
  .use(trailingSlashes("never"))
  .fsRoutes();
