interface Props {
  url: URL;
}

export default function MetaCanonicalUrl({ url }: Props) {
  if (import.meta.env.DEV) return null;
  const canonicalUrl = new URL(url);
  canonicalUrl.protocol = "https";
  canonicalUrl.searchParams.sort();
  const HOSTNAME = Deno.env.get("HOSTNAME");
  if (HOSTNAME) canonicalUrl.hostname = HOSTNAME;
  return <link rel="canonical" href={canonicalUrl.href} />;
}
