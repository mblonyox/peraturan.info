import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { JENIS_PERATURAN } from "../utils/const.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="gDCSCeR4yYkod7yJBudB-0OZEo2y507Hz8iNuCeDgwU"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
        />
      </Head>
      <nav class="container">
        <ul>
          <li>
            <a href="/">
              <strong>peraturan.deno.dev</strong>
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <a href="/new">Terbaru</a>
          </li>
          <li>
            <details role="list">
              <summary aria-haspopup="listbox" role="link">
                Peraturan
              </summary>
              <ul role="listbox">
                {JENIS_PERATURAN.map((x) => (
                  <li>
                    <a href={`/${x.kode}`}>{x.singkatan ?? x.nama}</a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </nav>
      <hr />
      <main class="container">
        <Component></Component>
      </main>
      <footer>
        <div className="container">
          <hr />
          {"Created with ☕ by "}
          <a
            href="https://mblonyox.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            @mblonyox
          </a>
        </div>
      </footer>
    </>
  );
}
