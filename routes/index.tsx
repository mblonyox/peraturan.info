import { asset } from "fresh/runtime";
import type { SearchAction, WebSite, WithContext } from "schema-dts";

import { NAMA2_JENIS } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";

export const handler = define.handlers((ctx) => {
  const searchAction: SearchAction & { "query-input": string } = {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": ctx.url.origin +
        "/search?query={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  };

  const website: WithContext<
    WebSite
  > = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": ctx.url.toString(),
    "potentialAction": searchAction,
  };
  ctx.state.heads = (
    <script
      type="application/ld+json"
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(website),
      }}
    />
  );
  return { data: null };
});

export default define.page(() => (
  <>
    <div className="py-5 my-5 text-center">
      <img
        src={asset("/logo.webp")}
        alt="Logo Peraturan.Info"
        className="d-block mx-auto"
        width={256}
        height={256}
      />
      <h1 className="display-5 fw-bold">
        Peraturan<span className="text-muted">.Info</span>
      </h1>
      <div className="col-lg-6 mx-auto">
        <p>
          Peraturan.Info adalah upaya untuk meningkatkan cara penyajian
          peraturan perundang-undangan di Indonesia sehingga lebih user-friendly
          yang terinspirasi dari layanan{" "}
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
));
