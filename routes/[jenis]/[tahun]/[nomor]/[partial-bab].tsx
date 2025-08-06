import { HttpError, type RouteConfig } from "fresh";

import PeraturanIsi from "~/components/peraturan_isi.tsx";
import { getDB } from "~/lib/db/mod.ts";
import { getPeraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { readTextMd } from "~/utils/fs.ts";
import { createMarked, PeraturanToken } from "~/utils/md.ts";
import { ellipsis } from "~/utils/string.ts";

interface Data {
  path: string;
  md: string;
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
}

export const config: RouteConfig = {
  routeOverride:
    "/:jenis/:tahun/:nomor/:bab(bab-[mdclxvi]+){/:bagian(bagian-\\w+)}?{/:paragraf(paragraf-\\d+)}?",
};

export const handler = define.handlers<Data>(async (ctx) => {
  const { jenis, tahun, nomor, bab, bagian, paragraf } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) throw new HttpError(404);
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) throw new HttpError(404);
  const marked = createMarked();
  const rootTokens = marked.lexer(md);
  const breadcrumbs: { name: string; url?: string }[] = [
    ...peraturan.breadcrumbs,
  ];
  const juduls = [];
  let tokens = [...rootTokens] as PeraturanToken[];
  let token, prev, next;
  for (const [k, v] of Object.entries({ bab, bagian, paragraf })) {
    if (!v) continue;
    tokens = tokens.filter((token) => token.type === k);
    token = tokens.find((token) =>
      token.nomor?.toLowerCase().replace(" ", "-") === v
    );
    if (!token?.nomor) throw new HttpError(404);
    const path = breadcrumbs.at(-1)?.url + "/";
    breadcrumbs.push({
      name: token.nomor,
      url: path + token.nomor.toLowerCase().replace(" ", "-"),
    });
    juduls.push(token.nomor);
    const index = tokens.indexOf(token);
    if (index > 0) {
      const prevToken = tokens[index - 1];
      if (prevToken.nomor) {
        prev = {
          name: prevToken.nomor,
          url: path + prevToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
    }
    if (index < tokens.length - 1) {
      const nextToken = tokens[index + 1];
      if (nextToken.nomor) {
        next = {
          name: nextToken.nomor,
          url: path + nextToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
    }
    tokens = token.tokens!;
  }
  if (!token?.nomor) throw new HttpError(404);
  breadcrumbs.pop();
  breadcrumbs.push({ name: token.nomor });
  juduls.pop();
  juduls.push(token.judul);
  const judulPartial = juduls.join(", ");
  const html = marked.parser([token as PeraturanToken]);
  ctx.state.seo = {
    title: `${judulPartial} | ${peraturan.rujukPanjang}`,
    description: ellipsis(token.raw),
    image: `${ctx.url.origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = breadcrumbs;
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  const path = `/${jenis}/${tahun}/${nomor}`;
  return { data: { path, md, html, prev, next } };
});

export default define.page<typeof handler>(({ data }) => (
  <PeraturanIsi {...data} />
));
