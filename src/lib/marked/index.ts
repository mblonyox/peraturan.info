import { marked } from "marked";

import { extension, type PeraturanToken } from "./extension";

marked.use(extension);

export { marked, type PeraturanToken };
