import { Head } from "$fresh/runtime.ts";
import { useAppContext } from "@/utils/app_context.tsx";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/utils/const.ts";

export default function SeoTags() {
  const { url, seo } = useAppContext();
  const title = seo?.title ?? SEO_TITLE;
  const description = seo?.description ?? SEO_DESCRIPTION;
  const image = seo?.image ?? (url + "?social-image");

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url?.toString()} />
      <meta name="twitter:creator" content="@mblonyox" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url?.toString()} />
      <meta property="og:site_name" content="Peraturan.deno.dev" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            name: title,
            about: description,
            url: url?.toString(),
          }),
        }}
      />
      {!!image && (
        <>
          <meta itemProp="image" content={image} />
          <meta name="twitter:image" content={image} />
          <meta property="og:image" content={image} />
        </>
      )}
    </Head>
  );
}
