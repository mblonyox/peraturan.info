import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { marked } from "marked";
import { PartialToken, peraturan as peraturanExtension } from "@utils/md.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan } from "@models/mod.ts";
import { readTextMd } from "@utils/fs.ts";
import { AppContextState } from "@utils/app_context.tsx";
import { ellipsis } from "@utils/string.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";
import PrintButton from "@islands/print_button.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:jenis/:tahun/:nomor/:buku(buku-\\w+){/:bab(bab-[mdclxvi]+)}?{/:bagian(bagian-\\w+)}?{/:paragraf(paragraf-\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageProps, AppContextState> =
  async (_req, ctx) => {
    const { jenis, tahun, nomor, buku, bab, bagian, paragraf } = ctx.params;
    const db = await getDB();
    const peraturan = getPeraturan(db, jenis, tahun, nomor);
    if (!peraturan) return ctx.renderNotFound();
    const md = await readTextMd({ jenis, tahun, nomor });
    if (!md) return ctx.renderNotFound();
    marked.use(peraturanExtension);
    const rootTokens = marked.lexer(md);
    const breadcrumbs: { name: string; url?: string }[] = [
      ...peraturan.breadcrumbs,
    ];
    const juduls = [];
    let tokens = [...rootTokens] as PartialToken[];
    let token, prev, next;
    for (const [k, v] of Object.entries({ buku, bab, bagian, paragraf })) {
      if (!v) continue;
      tokens = tokens.filter((token) => token.type === k);
      token = tokens.find((token) =>
        token.nomor.toLowerCase().replace(" ", "-") === v
      );
      if (!token) return ctx.renderNotFound();
      const path = breadcrumbs.at(-1)?.url + "/";
      breadcrumbs.push({
        name: token.nomor,
        url: path + token.nomor.toLowerCase().replace(" ", "-"),
      });
      juduls.push(token.nomor);
      const index = tokens.indexOf(token);
      if (index > 0) {
        const prevToken = tokens[index - 1];
        prev = {
          name: prevToken.nomor,
          url: path + prevToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
      if (index < tokens.length - 1) {
        const nextToken = tokens[index + 1];
        next = {
          name: nextToken.nomor,
          url: path + nextToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
      tokens = token.tokens!;
    }
    if (!token) return ctx.renderNotFound();
    breadcrumbs.pop();
    breadcrumbs.push({ name: token.nomor });
    juduls.pop();
    juduls.push(token.judul);
    const judulPartial = juduls.join(", ");
    const html = marked.parser([token as marked.Token]);
    ctx.state.seo = {
      title: `${judulPartial} | ${peraturan.rujukPanjang}`,
      description: ellipsis(token.raw, 155),
    };
    ctx.state.breadcrumbs = breadcrumbs;
    ctx.state.pageHeading = {
      title: peraturan.judul,
      description: peraturan.rujukPendek,
    };
    return ctx.render({ html, prev, next });
  };

interface PeraturanPartialPageProps {
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
}

export default function PeraturanPartialPage(
  {
    data: {
      html,
      prev,
      next,
    },
  }: PageProps<
    PeraturanPartialPageProps
  >,
) {
  return (
    <PeraturanLayout activeTab="isi">
      <div className="d-flex justify-content-between my-2">
        <a
          className={"btn btn-outline-secondary" + (!prev ? " disabled" : "")}
          href={prev?.url}
        >
          &lt;&lt; {prev?.name}
        </a>
        <PrintButton />
        <a
          className={"btn btn-outline-secondary" + (!next ? " disabled" : "")}
          href={next?.url}
        >
          {next?.name} &gt;&gt;
        </a>
      </div>
      <PeraturanMarkdown html={html} />
    </PeraturanLayout>
  );
}
