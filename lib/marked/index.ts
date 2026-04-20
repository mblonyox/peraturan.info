import { marked } from "marked";

import { extension, type PeraturanToken } from "./extension";
export const createMarked = () => marked.use(extension);
export { PeraturanToken };
