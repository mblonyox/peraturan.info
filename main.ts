import type { State } from "~/utils/define.ts";
import { secureHeaders } from "~/utils/secure-headers.ts";
import { App, csp, staticFiles, trailingSlashes } from "fresh";

export const app = new App<State>()
  .use(secureHeaders())
  .use(csp({
    csp: [
      "script-src https://www.googletagmanager.com",
      "connect-src https://mouthful.inoxsegar.com",
      "style-src blob:",
    ],
  }))
  .use(staticFiles())
  .use(trailingSlashes("never"))
  .fsRoutes();
