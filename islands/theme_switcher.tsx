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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-palette-fill inline-block"
          viewBox="0 0 16 16"
        >
          <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
        </svg>
        <span className="hidden lg:inline-block">
          Tema
        </span>
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
