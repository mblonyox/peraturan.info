import { asset, Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { WebSite, WithContext } from "schema-dts";
import { NAMA2_JENIS } from "@/models/mod.ts";

export default function Home({ url }: PageProps) {
  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": url.toString(),
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": url.origin +
          "/search?query={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(website),
          }}
        />
      </Head>
      <div className="py-5 my-5 text-center">
        <img
          src={asset("/logo.webp")}
          alt="Logo Peraturan.deno.dev"
          className="d-block mx-auto"
          width={256}
          height={256}
        />
        <h1 className="display-5 fw-bold">
          Peraturan<span className="text-muted">
            .deno.dev
          </span>
        </h1>
        <div className="col-lg-6 mx-auto">
          <p>
            Peraturan.deno.dev adalah upaya untuk meningkatkan cara penyajian
            peraturan perundang-undangan di Indonesia sehingga lebih
            user-friendly yang terinspirasi dari layanan{" "}
            <a
              href="https://legislation.gov.uk"
              target="_blank"
              rel="noreferrer noopener"
            >
              legislation.gov.uk
            </a>.
          </p>
        </div>
      </div>
      <div className="col-lg-6 mx-auto my-5">
        <p>
          Mulai cari peraturan dari bentuk-bentuk berikut:
        </p>
        <ul>
          {Object.entries(NAMA2_JENIS).map(([kode, { panjang }]) => (
            <li>
              <a href={`/${kode}`}>{panjang}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
