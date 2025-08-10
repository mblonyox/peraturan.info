import { useEffect, useState } from "preact/hooks";
import { type ThemeOption, themeOptions } from "~/utils/theme.ts";

interface Props {
  initTheme?: ThemeOption;
}

export default function ThemeSwitcher({ initTheme }: Props) {
  const [theme, setTheme] = useState<ThemeOption | undefined>(initTheme);

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme}; Max-Age=1707109200; Path=/`;
    }
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        Tema
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z">
          </path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-base-300 rounded-box z-1 p-2 shadow-2xl"
      >
        {themeOptions.map((t) => (
          <li>
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
