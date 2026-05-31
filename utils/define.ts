import { createDefine } from "fresh";

export interface State {
  seo?: { title: string; description: string; image?: string };
  breadcrumbs?: { name: string; url?: string }[];
  pageHeading?: {
    title: string;
    description: string;
  };
  [k: string]: unknown;
}

export const define = createDefine<State>();
