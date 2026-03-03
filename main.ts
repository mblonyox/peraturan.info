import { canonicalHostname } from "~/middlewares/canonical-hostname.ts";
import { logger } from "~/middlewares/logger.tsx";
import { secureHeaders } from "~/middlewares/secure-headers.ts";
import { sessionId } from "~/middlewares/session-id.ts";
import type { State } from "~/utils/define.ts";

import { App, staticFiles, trailingSlashes } from "fresh";

export const app = new App<State>()
  .use(
    canonicalHostname({
      hostname: "peraturan.info",
      exclude: ["localhost", "127.0.0.1", /^peraturan\-.+\.deno\.dev$/],
    }),
  )
  .use(logger())
  .use(secureHeaders())
  .use(sessionId())
  .use(staticFiles())
  .use(trailingSlashes("never"))
  .fsRoutes();
