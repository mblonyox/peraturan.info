/// <reference lib="dom" />

import { App, staticFiles } from "fresh";

import type { State } from "~/utils/define.ts";

export const app = new App<State>()
  .use(staticFiles())
  .fsRoutes();
