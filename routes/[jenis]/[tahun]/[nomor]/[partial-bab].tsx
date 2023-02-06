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
  routeOverride:
    "/:jenis/:tahun/:nomor/:bab(bab-[mdclxvi]+){/:bagian(bagian-\\w+)}?{/:paragraf(paragraf-\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor, bab, bagian, paragraf } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  marked.use(peraturanExtension);
  const tokens = marked.lexer(md);
  let token: marked.Tokens.Generic | undefined;
  // deno-lint-ignore no-explicit-any
  token = tokens.find((token: any) => {
    const slug = token?.nomor?.toLowerCase()?.replace(" ", "-");
    return token.type === "bab" &&
      slug === bab;
  });
  if (bagian) {
    // deno-lint-ignore no-explicit-any
    token = token?.tokens?.find((token: any) => {
      const slug = token?.nomor?.toLowerCase()?.replaceAll(" ", "-");
      return token.type === "bagian" &&
        slug === bagian;
    });

    if (paragraf) {
      // deno-lint-ignore no-explicit-any
      token = token?.tokens?.find((token: any) => {
        const slug = token?.nomor?.toLowerCase()?.replaceAll(" ", "-");
        return token.type === "paragraf" &&
          slug === paragraf;
      });
    }
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
