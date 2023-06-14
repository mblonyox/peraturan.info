import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { AppContextProvider } from "@/utils/app_context.tsx";
import LayoutNavbar from "@/components/layout_navbar.tsx";
import LayoutFooter from "@/components/layout_footer.tsx";
import LayoutBreadcrumbs from "@/components/layout_breadcrumbs.tsx";
import LayoutPageHeading from "@/components/layout_page_heading.tsx";
import SeoTags from "@/components/seo_tags.tsx";

export default function App(
  { Component, data, url }: AppProps,
) {
  return (
    <AppContextProvider value={{ url, ...data?.appContext }}>
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
      </Head>
      <SeoTags />
      <LayoutNavbar />
      <main className="py-2 py-lg-3">
        <div className="container">
          <LayoutBreadcrumbs />
          <LayoutPageHeading />
          <Component></Component>
        </div>
      </main>
      <LayoutFooter />
    </AppContextProvider>
  );
}
