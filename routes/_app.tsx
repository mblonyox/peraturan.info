import SeoTags from "~/components/seo_tags.tsx";
import { GOOGLE_TAG_ID, HOSTNAME } from "~/utils/const.ts";
import { define } from "~/utils/define.ts";

export default define.page(({ Component, url, state }) => {
  const canonicalUrl = new URL(url);
  canonicalUrl.protocol = "https";
  canonicalUrl.searchParams.sort();
  if (HOSTNAME) canonicalUrl.hostname = HOSTNAME;
  return (
    <html lang="id" data-bs-theme={state.theme}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="canonical" href={canonicalUrl.toString()} />
        <link rel="me" href="mailto:mblonyox@gmail.com" />
        <link
          rel="webmention"
          href="https://webmention.io/peraturan.info/webmention"
        />
        <link
          rel="pingback"
          href="https://webmention.io/peraturan.info/xmlrpc"
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
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
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
      <body style={{ overflowY: "scroll", overflowX: "hidden" }}>
        <Component />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          defer
        />
        <script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          defer
        />
        <script
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              gtag('config', '${GOOGLE_TAG_ID}');
              `,
          }}
          defer
        />
      </body>
    </html>
  );
});
