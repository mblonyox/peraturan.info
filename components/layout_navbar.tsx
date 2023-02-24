import { asset } from "$fresh/runtime.ts";
import { useAppContext } from "@/utils/app_context.tsx";
import DarkModeToggler from "@/islands/dark_mode_toggler.tsx";

export default function LayoutNavbar() {
  const { theme, url } = useAppContext();
  const pathname = new URL(url ?? "").pathname;

  const menus = [
    { path: "/uu", teks: "Undang\u2011Undang" },
    { path: "/perppu", teks: "Perppu" },
    { path: "/pp", teks: "Peraturan Pemerintah" },
    { path: "/perpres", teks: "Peraturan Presiden" },
    { path: "/permenkeu", teks: "Peraturan Menteri Keuangan" },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-secondary-subtle">
      <div className="container">
        <a href="/" className="navbar-brand">
          <img
            src={asset("/logo.webp")}
            alt="Logo Peraturan.deno.dev"
            width={32}
            height={32}
          />
        </a>
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
                className={"nav-link" + (pathname === "/new" ? " active" : "")}
                aria-current={pathname === "/new" ? "page" : "false"}
                href="/new"
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
          <form className="d-flex mx-lg-2" role="search">
            <div className="input-group">
              <input
                name="query"
                className="form-control"
                type="search"
                placeholder="Pencarian..."
                aria-label="Pencarian"
              />
              <button className="btn btn-outline-secondary" type="submit">
                Cari
              </button>
            </div>
          </form>
          <DarkModeToggler initTheme={theme} />
        </div>
      </div>
    </nav>
  );
}
