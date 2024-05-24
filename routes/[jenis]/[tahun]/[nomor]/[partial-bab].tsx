import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { Token, use } from "marked";
import { getDB } from "@/lib/db/mod.ts";
import { getPeraturan } from "@/models/mod.ts";
import { PartialToken, peraturan as peraturanExtension } from "@/utils/md.ts";
import { readTextMd } from "@/utils/fs.ts";
import { ellipsis } from "@/utils/string.ts";
import PeraturanIsi from "@/components/peraturan_isi.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:jenis/:tahun/:nomor/:bab(bab-[mdclxvi]+){/:bagian(bagian-\\w+)}?{/:paragraf(paragraf-\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageData> = async (
  req,
  ctx,
) => {
  const { jenis, tahun, nomor, bab, bagian, paragraf } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  const marked = use(peraturanExtension);
  const rootTokens = marked.lexer(md);
  const breadcrumbs: { name: string; url?: string }[] = [
    ...peraturan.breadcrumbs,
  ];
  const juduls = [];
  let tokens = [...rootTokens] as PartialToken[];
  let token, prev, next;
  for (const [k, v] of Object.entries({ bab, bagian, paragraf })) {
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
  const html = marked.parser([token as Token]);
  ctx.state.seo = {
    title: `${judulPartial} | ${peraturan.rujukPanjang}`,
    description: ellipsis(token.raw),
    image: `${new URL(req.url).origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = breadcrumbs;
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  const path = `/${jenis}/${tahun}/${nomor}`;
  return ctx.render({ path, md, html, prev, next });
};

interface PeraturanPartialPageData {
  path: string;
  md: string;
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
}

export default function PeraturanPartialPage(
  { data }: PageProps<PeraturanPartialPageData>,
) {
  return <PeraturanIsi {...data} />;
}
