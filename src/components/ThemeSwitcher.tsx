import { Icon } from "astro-iconset/react";
import { useEffect, useState } from "react";

import { themeOptions } from "@/lib/utils/theme";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    if (typeof localStorage !== "undefined")
      setTheme(localStorage.getItem("theme"));
  }, []);

  useEffect(() => {
    if (theme && typeof localStorage !== "undefined")
      localStorage.setItem("theme", theme);
  }, [theme]);

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
        tabIndex={-1}
        className="dropdown-content bg-base-300 rounded-box z-1 p-2 shadow-2xl"
      >
        {themeOptions.map((t) => (
          <li key={t}>
            <input
              type="radio"
              name="theme-dropdown"
              className="btn btn-sm btn-block btn-ghost justify-start theme-controller"
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
