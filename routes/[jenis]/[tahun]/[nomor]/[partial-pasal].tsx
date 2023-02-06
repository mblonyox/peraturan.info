import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { marked } from "marked";
import { peraturan as peraturanExtension } from "@utils/md.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";

export const config: RouteConfig = {
  routeOverride: "/:jenis/:tahun/:nomor/:pasal(pasal-\\d+){/ayat-:ayat(\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor, pasal, ayat } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  marked.use(peraturanExtension);
  const tokens = marked.lexer(md);
  // deno-lint-ignore no-explicit-any
  const getPasal = (tokens: any[]): any[] =>
    tokens.map((token) =>
      token.type === "pasal" ? [token] : getPasal(token?.tokens ?? [])
    ).flat();
  const pasals = getPasal(tokens);
  let token;

  // deno-lint-ignore no-explicit-any
  token = pasals.find((token: any) => {
    const slug = token?.nomor?.toLowerCase()?.replace(" ", "-");
    return slug === pasal;
  });
  if (ayat) {
    // deno-lint-ignore no-explicit-any
    token = token?.tokens?.find((token: any) => {
      const slug = token?.nomor?.toLowerCase()?.replaceAll(/[\(\)]/g, "");
      return token.type === "ayat" &&
        slug === ayat;
    });
  }
  if (!token) return ctx.renderNotFound();
  const html = marked.parser([token as marked.Token]);
  return ctx.render({ peraturan, html });
};

interface PeraturanPartialPageProps {
  peraturan: Peraturan;
  html: string;
}

export default function PeraturanPartialPage(
  {
    data: {
      peraturan,
      html,
    },
  }: PageProps<
    PeraturanPartialPageProps
  >,
) {
  return (
    <PeraturanLayout
      {...{
        peraturan,
        activeTab: "isi",
        kerangkaEnabled: true,
        isiEnabled: true,
      }}
    >
      <PeraturanMarkdown html={html} />
    </PeraturanLayout>
  );
}
