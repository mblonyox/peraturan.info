"use client";

import { createContext, useContext, useEffect, useState } from "react";

const NavContext = createContext<{
  prev: { name: string; url: string } | null;
  next: { name: string; url: string } | null;
  setPrev: (prev: { name: string; url: string } | null) => void;
  setNext: (next: { name: string; url: string } | null) => void;
} | null>(null);

export function NavContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prev, setPrev] = useState<{ name: string; url: string } | null>(null);
  const [next, setNext] = useState<{ name: string; url: string } | null>(null);

  return (
    <NavContext.Provider value={{ prev, next, setPrev, setNext }}>
      {children}
    </NavContext.Provider>
  );
}

function useNavContext() {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNavContext must be used within a NavContextProvider");
  }
  return context;
}

export function Nav({ basePath }: { basePath: string }) {
  const { prev, next } = useNavContext();

  return (
    <>
      {!prev ? (
        <button type="button" disabled className="btn btn-outline mx-2">
          &lt;&lt;
        </button>
      ) : (
        <a className="btn btn-outline mx-2" href={`${basePath}/${prev.url}`}>
          &lt;&lt;
          <span className="hidden md:inline">{prev.name}</span>
        </a>
      )}
      {!next ? (
        <button type="button" disabled className="btn btn-outline mx-2">
          &gt;&gt;
        </button>
      ) : (
        <a className="btn btn-outline mx-2" href={`${basePath}/${next.url}`}>
          &gt;&gt;
          <span className="hidden md:inline">{next.name}</span>
        </a>
      )}
    </>
  );
}

export function SetNav({
  prev,
  next,
}: {
  prev: { name: string; url: string } | null;
  next: { name: string; url: string } | null;
}) {
  const { setPrev, setNext } = useNavContext();
  useEffect(() => {
    setPrev(prev);
    setNext(next);
  }, [prev, next, setPrev, setNext]);
  return null;
}
