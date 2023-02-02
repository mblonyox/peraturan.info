import { asset, Head } from "$fresh/runtime.ts";
import { marked } from "marked";
import { bab, bagian, paragraf, pasal, pembukaan } from "@utils/md.ts";

interface PeraturanMarkdownProps {
  md: string;
}

export default function PeraturanMarkdown({ md }: PeraturanMarkdownProps) {
  marked.use({ extensions: [pembukaan, bab, bagian, paragraf, pasal] });
  const parsed = marked.parse(md, { breaks: true, gfm: true });
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
          <div class="isi" dangerouslySetInnerHTML={{ __html: parsed }}>
          </div>
        </div>
      </div>
    </>
  );
}
