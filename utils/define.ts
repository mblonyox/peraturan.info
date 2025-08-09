import { createDefine } from "fresh";
import { JSX } from "preact/compat/jsx-dev-runtime";

export interface State {
  theme?: "dark" | "light";
  seo?: { title: string; description: string; image?: string };
  breadcrumbs?: { name: string; url?: string }[];
  pageHeading?: {
    title: string;
    description: string;
  };
  heads?: JSX.Element;
}

export const define = createDefine<State>();
