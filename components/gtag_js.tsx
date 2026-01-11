export default function GTagJs() {
  if (import.meta.env.DEV) return null;
  const GOOGLE_TAG_ID = Deno.env.get("GOOGLE_TAG_ID");
  if (!GOOGLE_TAG_ID) return null;
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
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
      />
    </>
  );
}
