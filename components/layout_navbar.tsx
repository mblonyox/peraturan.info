import SearchInput from "~/islands/search_input.tsx";
import ThemeSwitcher from "~/islands/theme_switcher.tsx";
import type { ThemeOption } from "~/utils/theme.ts";
import { clsx } from "clsx";
import { asset } from "fresh/runtime";

const menus = [
  { href: "/", text: "Beranda" },
  { href: "/terbaru", text: "Terbaru" },
  {
    href: "#",
    text: "Peraturan",
    menu: [
      { href: "/uu", text: "Undang\u2011Undang" },
      { href: "/perppu", text: "Perppu" },
      { href: "/pp", text: "Peraturan\u00A0Pemerintah" },
      { href: "/perpres", text: "Peraturan\u00A0Presiden" },
      { href: "/permenkeu", text: "Peraturan\u00A0Menteri\u00A0Keuangan" },
    ],
  },
];

interface Props {
  url: URL;
  theme?: ThemeOption;
}

export default function LayoutNavbar({ url, theme }: Props) {
  const { pathname, searchParams } = url;

  return (
    <nav className="navbar bg-base-200">
      <div className="navbar-start">
        <details class="flex-none lg:hidden dropdown">
          <summary
            aria-label="Show Menu"
            class="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              >
              </path>
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-base-300 rounded-box z-1 p-2 shadow-2xl">
            {menus.map(({ href, text, menu }) => (
              <li>
                {menu
                  ? (
                    <details open>
                      <summary>{text}</summary>
                      <ul>
                        {menu.map(({ href, text }) => (
                          <li>
                            <a
                              href={href}
                              className={clsx(
                                pathname === href && "menu-active",
                              )}
                              aria-current={pathname === href
                                ? "page"
                                : "false"}
                            >
                              {text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )
                  : (
                    <a
                      href={href}
                      className={clsx(pathname === href && "menu-active")}
                      aria-current={pathname === href ? "page" : "false"}
                    >
                      {text}
                    </a>
                  )}
              </li>
            ))}
          </ul>
        </details>
        <a href="/">
          <img
            src={asset("/logo.webp")}
            alt="Logo Peraturan.Info"
            width={32}
            height={32}
          />
        </a>
        <ul className="hidden lg:flex menu menu-horizontal rounded-box gap-2">
          {menus.map(({ href, text, menu }) => (
            <li>
              {menu
                ? (
                  <details className="dropdown">
                    <summary>{text}</summary>
                    <ul className="menu dropdown-content bg-base-300 rounded-box z-1 p-2 shadow-2xl">
                      {menu.map(({ href, text }) => (
                        <li>
                          <a
                            href={href}
                            className={clsx(pathname === href && "menu-active")}
                            aria-current={pathname === href ? "page" : "false"}
                          >
                            {text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                )
                : (
                  <a
                    href={href}
                    className={clsx(pathname === href && "menu-active")}
                    aria-current={pathname === href ? "page" : "false"}
                  >
                    {text}
                  </a>
                )}
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-center">
        <SearchInput initQuery={searchParams.get("query")?.trim()} />
      </div>
      <div className="navbar-end">
        <ThemeSwitcher initTheme={theme} />
      </div>
    </nav>
  );
}
