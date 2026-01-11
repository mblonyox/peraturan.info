import GTagJs from "~/components/gtag_js.tsx";
import MetaCanonicalUrl from "~/components/meta_canonical_url.tsx";
import SeoTags from "~/components/seo_tags.tsx";
import { define } from "~/utils/define.ts";

export default define.page(({ Component, url, state }) => {
  return (
    <html lang="id" data-theme={state.theme}>
      <head>
        <MetaCanonicalUrl url={url} />
        <GTagJs />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          href="/search.xml"
          title="Pencarian"
        />
        <link
          rel="alternate"
          href="/atom.xml"
          type="application/atom+xml"
          title="Atom"
        />
        <link
          rel="alternate"
          href="/rss.xml"
          type="application/rss+xml"
          title="RSS"
        />
        <link
          rel="alternate"
          href="/feed.json"
          type="application/feed+json"
          title="JSON Feed"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://mouthful.inoxsegar.com"
          crossOrigin="anonymous"
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
        <SeoTags url={url} {...state.seo} />
      </head>
      <body className="min-w-sm">
        <Component />
      </body>
    </html>
  );
});
