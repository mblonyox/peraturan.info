import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { marked } from "marked";
import { peraturan as peraturanExtension } from "@utils/md.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan } from "@models/mod.ts";
import { readTextMd } from "@utils/fs.ts";
import { AppContextState } from "@utils/app_context.tsx";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";
import PrintButton from "@islands/print_button.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:jenis/:tahun/:nomor/:partial(judul|pembukaan|konsideran|dasar-hukum|batang-tubuh)",
};

export const handler: Handler<PeraturanPartialPageProps, AppContextState> =
  async (_req, ctx) => {
    const { jenis, tahun, nomor, partial } = ctx.params;
    console.log({ partial });
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
    let tokens: marked.Tokens.Generic[] | undefined;
    if (partial === "pembukaan") {
      tokens = rootTokens.filter((token) =>
        ["frasa-jabatan", "konsideran", "dasar-hukum", "diktum"].includes(
          token.type,
        )
      );
    } else if (partial === "batang-tubuh") {
      tokens = rootTokens.filter((token) =>
        ["buku", "bab", "pasal"].includes(
          token.type,
        )
      );
    } else {
      tokens = rootTokens.filter((token) => token.type === partial);
    }
    const judulPartial = partial.split("-").map((word) =>
      word[0].toUpperCase() + word.substring(1)
    ).join(" ");
    breadcrumbs.push({ name: judulPartial });
    if (!tokens || !tokens.length) return ctx.renderNotFound();
    const html = marked.parser(tokens as marked.Token[]);
    ctx.state.seo = {
      title: `${judulPartial} | ${peraturan.rujukPanjang}`,
      description: `${tokens.map((token) => token.raw).join("\n")}`,
    };
    ctx.state.breadcrumbs = breadcrumbs;
    ctx.state.pageHeading = {
      title: peraturan.judul,
      description: peraturan.rujukPendek,
    };
    return ctx.render({ html });
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
