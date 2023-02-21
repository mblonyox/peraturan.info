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
    const tokens = marked.lexer(md);
    const breadcrumbs: { name: string; url?: string }[] = [
      ...peraturan.breadcrumbs,
    ];
    const juduls = [];
    let token: marked.Tokens.Generic | undefined;
    // deno-lint-ignore no-explicit-any
    token = tokens.find((token: any) => {
      const slug = token?.nomor?.toLowerCase()?.replace(" ", "-");
      return token.type === "buku" &&
        slug === buku;
    });
    if (bab) {
      breadcrumbs.push({
        name: token?.nomor,
        url: peraturan.path + "/" +
          token?.nomor?.toLowerCase()?.replace(" ", "-"),
      });
      juduls.push(token?.nomor);
      // deno-lint-ignore no-explicit-any
      token = token?.tokens?.find((token: any) => {
        const slug = token?.nomor?.toLowerCase()?.replace(" ", "-");
        return token.type === "bab" &&
          slug === bab;
      });
      if (bagian) {
        breadcrumbs.push({
          name: token?.nomor,
          url: breadcrumbs.at(-1)?.url + "/" +
            token?.nomor?.toLowerCase()?.replace(" ", "-"),
        });
        juduls.push(token?.nomor);
        // deno-lint-ignore no-explicit-any
        token = token?.tokens?.find((token: any) => {
          const slug = token?.nomor?.toLowerCase()?.replaceAll(" ", "-");
          return token.type === "bagian" &&
            slug === bagian;
        });

        if (paragraf) {
          breadcrumbs.push({
            name: token?.nomor,
            url: breadcrumbs.at(-1)?.url + "/" +
              token?.nomor?.toLowerCase()?.replace(" ", "-"),
          });
          juduls.push(token?.nomor);
          // deno-lint-ignore no-explicit-any
          token = token?.tokens?.find((token: any) => {
            const slug = token?.nomor?.toLowerCase()?.replaceAll(" ", "-");
            return token.type === "paragraf" &&
              slug === paragraf;
          });
        }
      }
    }
    if (!token) return ctx.renderNotFound();
    breadcrumbs.push({ name: token?.nomor });
    juduls.push(token?.judul);
    const judulPartial = juduls.join(", ");
    const html = marked.parser([token as marked.Token]);
    ctx.state.seo = {
      title: `${judulPartial} | ${peraturan.rujukPanjang}`,
      description: `${token.raw}.`,
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
}

export default function PeraturanPartialPage(
  {
    data: {
      html,
    },
  }: PageProps<
    PeraturanPartialPageProps
  >,
) {
  return (
    <PeraturanLayout activeTab="isi">
      <PeraturanMarkdown html={html} />
    </PeraturanLayout>
  );
}
