import { createDefine } from "fresh";
import type { JSX } from "preact";

export interface State {
  sessionId?: string;
  theme?:
    | "light"
    | "dark"
    | "retro"
    | "cyberpunk"
    | "valentine"
    | "aqua";
  seo?: { title: string; description: string; image?: string };
  breadcrumbs?: { name: string; url?: string }[];
  pageHeading?: {
    title: string;
    description: string;
  };
  heads?: JSX.Element;
  [k: string]: unknown;
}

export const define = createDefine<State>();
