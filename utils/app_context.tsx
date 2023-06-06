import { useContext } from "preact/hooks";
import { createContext } from "preact";

export type AppContext = {
  url?: URL;
  theme?: "dark" | "light";
  seo?: { title: string; description: string; image?: string };
  breadcrumbs?: { name: string; url?: string }[];
  pageHeading?: {
    title: string;
    description: string;
  };
};

const appContext = createContext<AppContext>({});

export const AppContextProvider = appContext.Provider;

export const useAppContext = () => useContext(appContext);
