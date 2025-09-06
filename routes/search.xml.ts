import { define } from "~/utils/define.ts";

export const handler = define.handlers({
  GET: ({ url }) => {
    const origin = url.origin;
    const body = `\
<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription
  xmlns="http://a9.com/-/spec/opensearch/1.1/"
  xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>Peraturan.Info</ShortName>
  <Description>Cari Peraturan Perundang-undangan dengan Peraturan.Info</Description>
  <Tags>peraturan puu uu perpu pp perpres</Tags>
  <Image width="16" height="16" type="image/x-icon">${origin}/favicon.ico</Image>
  <Url type="text/html" template="${origin}/search?query={searchTerms}&amp;page={startPage?}"/>
  <Url type="application/x-suggestions+json" template="${origin}/api/autocomple?query={searchTerms}"/>
  <Query role="example" searchTerms="uu" />
  <InputEncoding>UTF-8</InputEncoding>
  <OutputEncoding>UTF-8</OutputEncoding>
  <Language>id</Language>
</OpenSearchDescription>`;
    return new Response(body, {
      headers: { "Content-Type": "application/opensearchdescription+xml" },
    });
  },
});
