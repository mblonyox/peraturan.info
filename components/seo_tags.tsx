import { useContext } from "preact/hooks";
import { Head, HEAD_CONTEXT } from "$fresh/runtime.ts";

interface SeoTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export default function SeoTags(
  { title, description, image, url }: SeoTagsProps,
) {
  const headContext = useContext(HEAD_CONTEXT);
  const index = headContext.findIndex((children) =>
    Array.isArray(children) && children.at(0)?.type === "title"
  );
  if (index > 0) headContext.splice(index, 1);
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:creator" content="@mblonyox" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Peraturan.deno.dev" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            name: title,
            about: description,
            url: url,
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
