import { marked } from "marked";

import { extension } from "./extension";
import { sanitizeOptions } from "./sanitize";

marked.use(extension);

export { marked, sanitizeOptions };
export type { PeraturanToken } from "./extension";
