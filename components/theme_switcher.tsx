"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

import { themeOptions } from "@/utils/theme";

import IconArrowDown from "./icons/arrow-down";
import IconPalette from "./icons/palette";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme}; Max-Age=1707109200; Path=/`;
    }
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        aria-label="Switch Theme"
        className="btn m-1"
      >
        <IconPalette />
        <span className="hidden lg:inline-block">Tema</span>
        <IconArrowDown />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-base-300 rounded-box z-1 p-2 shadow-2xl"
      >
        {themeOptions.map((t) => (
          <li key={t}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label={t.toUpperCase()}
              value={t}
              checked={theme === t}
              onChange={() => setTheme(t)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
