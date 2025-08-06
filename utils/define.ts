import { createDefine } from "fresh";

export interface State {
  theme?: "dark" | "light";
  seo?: { title: string; description: string; image?: string };
  breadcrumbs?: { name: string; url?: string }[];
  pageHeading?: {
    title: string;
    description: string;
  };
}

export const define = createDefine<State>();
