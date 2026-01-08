import SeoTags from "~/components/seo_tags.tsx";
import { define } from "~/utils/define.ts";

export default define.page(({ Component, url, state }) => {
  const HOSTNAME = Deno.env.get("HOSTNAME");
  const GOOGLE_TAG_ID = Deno.env.get("GOOGLE_TAG_ID");
  const canonicalUrl = new URL(url);
  canonicalUrl.protocol = "https";
  canonicalUrl.searchParams.sort();
  if (HOSTNAME) canonicalUrl.hostname = HOSTNAME;
  return (
    <html lang="id" data-theme={state.theme}>
      <head>
        <base href="/" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="canonical" href={canonicalUrl.toString()} />
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
        <script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          async
        />
        <script
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{
            __html: `\
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG_ID}');
`,
          }}
        />
      </head>
      <body className="min-w-sm">
        <Component />
      </body>
    </html>
  );
});
