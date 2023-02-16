import { asset } from "$fresh/runtime.ts";
import { useContext } from "preact/hooks";
import { appContext } from "@utils/app_context.tsx";
import DarkModeToggler from "@islands/dark_mode_toggler.tsx";

export default function LayoutNavbar() {
  const { theme, url } = useContext(appContext);
  const pathname = new URL(url ?? "").pathname;

  const menus = [
    { path: "/uu", teks: "Undang\u2011Undang" },
    { path: "/perppu", teks: "Perppu" },
    { path: "/pp", teks: "Peraturan Pemerintah" },
    { path: "/perpres", teks: "Peraturan Presiden" },
    { path: "/permenkeu", teks: "Peraturan Menteri Keuangan" },
  ];

  return (
    <nav class="navbar navbar-expand-lg bg-secondary-subtle">
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
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav mb-2 me-auto mb-lg-0">
            <li class="nav-item">
              <a
                class={"nav-link" + (pathname === "/" ? " active" : "")}
                aria-current={pathname === "/" ? "page" : "false"}
                href="/"
              >
                Beranda
              </a>
            </li>
            <li class="nav-item">
              <a
                class={"nav-link" + (pathname === "/new" ? " active" : "")}
                aria-current={pathname === "/new" ? "page" : "false"}
                href="/new"
              >
                Terbaru
              </a>
            </li>
            <li class="nav-item dropdown">
              <a
                class={"nav-link dropdown-toggle" +
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
              <ul class="dropdown-menu">
                {menus.map(({ path, teks }) => (
                  <li>
                    <a
                      class={"dropdown-item nav-link" +
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
          <form class="d-flex mx-lg-2" role="search">
            <div className="input-group">
              <input
                name="query"
                class="form-control"
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
