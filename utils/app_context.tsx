import { useContext } from "preact/hooks";
import { createContext } from "preact";

export type AppContextState = {
  url?: string;
  theme?: "dark" | "light";
  seo?: { title: string; description: string; image?: string };
  breadcrumbs?: { name: string; url?: string }[];
};
const appContext = createContext<AppContextState>({});

export const AppContextProvider = appContext.Provider;

export const useAppContext = () => useContext(appContext);
