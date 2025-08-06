const defaultTitle = "Peraturan.Info";
const defaultDescription = "Peraturan.Info adalah upaya untuk meningkatkan " +
  "cara penyajian peraturan perundang-undangan di Indonesia sehingga lebih " +
  "user-friendly yang terinspirasi dari legislation.gov.uk.";

interface Props {
  url: URL;
  title?: string;
  description?: string;
  image?: string;
}

export default function SeoTags(
  { url, title = defaultTitle, description = defaultDescription, image }: Props,
) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url.toString()} />
      <meta name="twitter:creator" content="@mblonyox" />
      <meta name="twitter:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url.toString()} />
      <meta property="og:site_name" content="Peraturan.Info" />
      <meta property="og:image" content={image} />
    </>
  );
}
