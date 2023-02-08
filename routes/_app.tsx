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
        <meta name="theme-color" content="#11191f" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              `if (typeof navigator.serviceWorker !== 'undefined') { navigator.serviceWorker.register('/sw.js') }`,
          }}
        />
      </Head>
      <nav class="container">
        <ul>
          <li>
            <a href="/">
              <strong>peraturan</strong>.deno.dev
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <a href="/new">Terbaru</a>
          </li>
          <li>
            <details role="list" dir="rtl">
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
