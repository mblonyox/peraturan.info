import { marked } from "https://esm.sh/marked@4.2.12/";

interface PeraturanMarkdownProps {
  md: string;
}

export default function PeraturanMarkdown({ md }: PeraturanMarkdownProps) {
  const parsed = marked.parse(md, { breaks: true, gfm: true });
  return <div dangerouslySetInnerHTML={{ __html: parsed }}></div>;
}
