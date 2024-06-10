import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { createMarked, PeraturanToken } from "@/utils/md.ts";
import { getDB } from "@/lib/db/mod.ts";
import { getPeraturan } from "@/models/mod.ts";
import { readTextMd } from "@/utils/fs.ts";
import { ellipsis } from "@/utils/string.ts";
import PeraturanIsi from "@/components/peraturan_isi.tsx";

export const config: RouteConfig = {
  routeOverride: "/:jenis/:tahun/:nomor/:pasal(pasal-\\d+){/ayat-:ayat(\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageData> = async (req, ctx) => {
  const { jenis, tahun, nomor, pasal, ayat } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  const marked = createMarked();
  const tokens = marked.lexer(md);
  const getPasals = (
    tokens: PeraturanToken[],
  ): PeraturanToken[] =>
    tokens.map((token) =>
      token.type === "pasal"
        ? [token as PeraturanToken]
        : getPasals(token?.tokens ?? [])
    ).flat();
  const pasals = getPasals(tokens);
  let token: PeraturanToken | undefined, prev, next;
  const breadcrumbs: { name: string; url?: string }[] = [
    ...peraturan.breadcrumbs,
  ];
  token = pasals.find((token: PeraturanToken) => {
    const slug = token.nomor?.toLowerCase().replace(" ", "-");
    return slug === pasal;
  });
  if (!token?.nomor) return ctx.renderNotFound();
  {
    const index = pasals.indexOf(token);
    if (index > 0) {
      const prevToken = pasals[index - 1];
      if (prevToken.nomor) {
        prev = {
          name: prevToken.nomor,
          url: peraturan.path + "/" +
            prevToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
    }
    if (index < pasals.length - 1) {
      const nextToken = pasals[index + 1];
      if (nextToken.nomor) {
        next = {
          name: nextToken.nomor,
          url: peraturan.path + "/" +
            nextToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
    }
  }
  if (ayat) {
    breadcrumbs.push({
      name: token.nomor,
      url: peraturan.path + "/" + token.nomor.toLowerCase().replace(" ", "-"),
    });
    const pasal = token;
    const ayats = token.tokens as PeraturanToken[];
    token = ayats.find((token) => {
      const slug = token?.nomor?.toLowerCase()?.replaceAll(/[\(\)]/g, "");
      return token.type === "ayat" &&
        slug === ayat;
    });
    if (!token) return ctx.renderNotFound();
    const index = ayats.indexOf(token);
    if (index > 0) {
      const prevToken = ayats[index - 1];
      if (prevToken.nomor) {
        prev = {
          name: `${pasal.nomor} ayat ${prevToken?.nomor}`,
          url: peraturan.path + "/" +
            pasal.nomor!.toLowerCase()?.replace(" ", "-") + "/ayat-" +
            prevToken?.nomor?.toLowerCase()?.replaceAll(
              /[\(\)]/g,
              "",
            ),
        };
      }
    }
    if (index < ayats.length - 1) {
      const nextToken = ayats[index + 1];
      if (nextToken.nomor) {
        next = {
          name: `${pasal.nomor} ayat ${nextToken.nomor}`,
          url: peraturan.path + "/" +
            pasal.nomor!.toLowerCase().replace(" ", "-") + "/ayat-" +
            nextToken.nomor.toLowerCase().replaceAll(
              /[\(\)]/g,
              "",
            ),
        };
      }
    }
  }
  breadcrumbs.push({
    name: (token.type === "ayat" ? `ayat ` : "") + token?.nomor,
  });
  const judulPartial = breadcrumbs.slice(3).map(({ name }) => name).join(" ");
  const html = marked.parser([token as PeraturanToken]);
  ctx.state.seo = {
    title: `${judulPartial} | ${peraturan.rujukPanjang}`,
    description: ellipsis(token.raw, 155),
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
