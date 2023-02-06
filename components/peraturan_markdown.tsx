import { asset, Head } from "$fresh/runtime.ts";
import { marked } from "marked";
import { peraturan } from "@utils/md.ts";

interface PeraturanMarkdownProps {
  md?: string;
  html?: string;
}

export default function PeraturanMarkdown(
  { md, html }: PeraturanMarkdownProps,
) {
  if (md) {
    marked.use(peraturan);
    html = marked.parse(md);
  }
  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/bookman-old-style"
          rel="stylesheet"
        />
        <link
          href={asset("/peraturan.css")}
          rel="stylesheet"
        />
      </Head>
      <div className="peraturan wadah">
        <div className="kertas">
          <div class="isi" dangerouslySetInnerHTML={{ __html: html ?? "" }}>
          </div>
        </div>
      </div>
    </>
  );
}
