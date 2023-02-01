import { Head } from "$fresh/runtime.ts";
import { marked } from "https://esm.sh/marked@4.2.12/";

const style = `
.peraturan * {
  font-family: 'Bookman Old Style', sans-serif;
  font-size: 12pt;
  font-weight: normal;
  color: black;
}
.peraturan.wadah {
  background-color: grey;
  padding: 1rem;
}
.peraturan .kertas {
  width: 210mm;
  margin: auto;
  padding-top: 80mm;
  padding-left: 25mm;
  padding-right: 25mm;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;
}

.peraturan td, .peraturan.th{
  padding: 0;
  border: 0;
}

.peraturan :not(center, center > *) {
  text-align: justify;
}

.peraturan ol li::marker {
  width: 10mm;
}

.peraturan .tabulasi ol  {
  list-style: lower-alpha;
}
.peraturan .tabulasi ol ol {
  list-style: decimal;
}
.peraturan .tabulasi ol ol ol {
  list-style: lower-alpha;
}
.peraturan .tabulasi ol ol ol ol{
  list-style: decimal;
}
`;

interface PeraturanMarkdownProps {
  md: string;
}

export default function PeraturanMarkdown({ md }: PeraturanMarkdownProps) {
  const parsed = marked.parse(md, { breaks: true, gfm: true });
  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/bookman-old-style"
          rel="stylesheet"
        />
        <link href="/peraturan.css" rel="stylesheet" />
        <style>
          {style}
        </style>
      </Head>
      <div className="peraturan wadah">
        <div className="kertas">
          <div class="isi" dangerouslySetInnerHTML={{ __html: parsed }}>
          </div>
        </div>
      </div>
    </>
  );
}
