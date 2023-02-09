import { asset } from "$fresh/runtime.ts";

export default function LayoutNavbar() {
  const menus = [
    { url: "uu", teks: "Undang\u2011Undang" },
    { url: "perppu", teks: "Perppu" },
    { url: "pp", teks: "Peraturan Pemerintah" },
    { url: "perpres", teks: "Peraturan Presiden" },
    { url: "permenkeu", teks: "Peraturan Menteri Keuangan" },
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
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">
                Beranda
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/new">Terbaru</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Peraturan
              </a>
              <ul class="dropdown-menu">
                {menus.map(({ url, teks }) => (
                  <li>
                    <a class="dropdown-item" href={url}>{teks}</a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <form class="d-flex" role="search">
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
        </div>
      </div>
    </nav>
  );
}
