import { marked } from "marked";
import { extension } from "./extension";
export const createMarked = () => marked.use(extension);
