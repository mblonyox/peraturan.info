import { asset } from "fresh/runtime";
import type { SearchAction, WebSite, WithContext } from "schema-dts";

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
  <div className="hero min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <img
          src={asset("/logo.webp")}
          alt="Logo Peraturan.Info"
          className="mx-auto mb-5"
          width={256}
          height={256}
        />
        <h1 className="text-5xl font-bold mb-2">
          Peraturan<span className="text-neutral-500">.Info</span>
        </h1>
        <p className="mb-5">
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
        <a href="/all" className="btn btn-primary">Lihat Semua Peraturan.</a>
      </div>
    </div>
  </div>
));
