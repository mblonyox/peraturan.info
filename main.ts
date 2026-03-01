import type { State } from "~/utils/define.ts";
import { secureHeaders } from "~/utils/secure-headers.ts";
import { App, staticFiles, trailingSlashes } from "fresh";

export const app = new App<State>()
  .use(secureHeaders())
  .use(staticFiles())
  .use(trailingSlashes("never"))
  .fsRoutes();
