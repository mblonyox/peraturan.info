import { asset } from "fresh/runtime";

import DarkModeToggler from "~/islands/dark_mode_toggler.tsx";
import SearchInput from "~/islands/search_input.tsx";

const menus = [
  { path: "/uu", teks: "Undang\u2011Undang" },
  { path: "/perppu", teks: "Perppu" },
  { path: "/pp", teks: "Peraturan Pemerintah" },
  { path: "/perpres", teks: "Peraturan Presiden" },
  { path: "/permenkeu", teks: "Peraturan Menteri Keuangan" },
];

interface Props {
  url?: URL;
  theme?: "dark" | "light";
}

export default function LayoutNavbar({ url, theme }: Props) {
  const { pathname, searchParams } = new URL(url ?? "");

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-gradient">
      <div className="container gap-1">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <a href="/" className="navbar-brand">
          <img
            src={asset("/logo.webp")}
            alt="Logo Peraturan.Info"
            width={32}
            height={32}
          />
        </a>
        <div className="order-lg-4 flex-fill">
          <SearchInput initQuery={searchParams.get("query")?.trim()} />
        </div>
        <div className="order-lg-5">
          <DarkModeToggler initTheme={theme} />
        </div>
        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mb-2 me-auto mb-lg-0">
            <li className="nav-item">
              <a
                className={"nav-link" + (pathname === "/" ? " active" : "")}
                aria-current={pathname === "/" ? "page" : "false"}
                href="/"
              >
                Beranda
              </a>
            </li>
            <li className="nav-item">
              <a
                className={"nav-link" +
                  (pathname === "/terbaru" ? " active" : "")}
                aria-current={pathname === "/terbaru" ? "page" : "false"}
                href="/terbaru"
              >
                Terbaru
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className={"nav-link dropdown-toggle" +
                  (menus.some(({ path }) => (pathname.startsWith(path)))
                    ? " active"
                    : "")}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Peraturan
              </a>
              <ul className="dropdown-menu">
                {menus.map(({ path, teks }) => (
                  <li>
                    <a
                      className={"dropdown-item nav-link" +
                        (pathname.startsWith(path) ? " active" : "")}
                      aria-current={pathname.startsWith(path)
                        ? "page"
                        : "false"}
                      href={path}
                    >
                      {teks}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
