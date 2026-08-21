import { Icon } from "astro-iconset/react";
import { useEffect, useState } from "react";

import { themeOptions } from "@/lib/utils/theme";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        aria-label="Switch Theme"
        className="btn m-1"
      >
        <Icon name="ri:palette-line" />
        <span className="hidden lg:inline-block">Tema</span>
        <Icon
          name="ri:arrow-drop-down-line"
          className="hidden lg:inline-block"
        />
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
              className="btn btn-sm btn-block btn-ghost justify-start"
              aria-label={t.toUpperCase()}
              value={t}
              checked={theme === t}
              onChange={(e) => setTheme(e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
