import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import SeoTags from "@/components/seo_tags.tsx";
import { AppContext, AppContextProvider } from "@/utils/app_context.ts";
import { GOOGLE_TAG_ID } from "@/utils/const.ts";

export default function App(
  { Component, url, state }: AppProps<unknown, AppContext>,
) {
  return (
    <AppContextProvider value={{ url, ...state }}>
      <Head>
        <meta
          name="google-site-verification"
          content="gDCSCeR4yYkod7yJBudB-0OZEo2y507Hz8iNuCeDgwU"
        />
        <link rel="me" href="mailto:mblonyox@gmail.com" />
        <link
          rel="webmention"
          href="https://webmention.io/peraturan.deno.dev/webmention"
        />
        <link
          rel="pingback"
          href="https://webmention.io/peraturan.deno.dev/xmlrpc"
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
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          defer
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
            __html: `if (
                typeof navigator.serviceWorker !== "undefined" &&
                location.hostname !== "localhost"
              ) {
                self.addEventListener("load", async () => {
                  const registration = await navigator.serviceWorker.register("/sw.js");
                  if (registration.waiting) registration.waiting.postMessage("SKIP_WAITING");
                });
              }`,
          }}
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              gtag('config', '${GOOGLE_TAG_ID}');
              `,
          }}
        />
      </Head>
      <SeoTags />
      <Component />
    </AppContextProvider>
  );
}
