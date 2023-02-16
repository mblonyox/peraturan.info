import { createContext } from "preact";

export type AppContext = {
  theme?: "dark" | "light";
  url?: string;
};
export const appContext = createContext<AppContext>({});
