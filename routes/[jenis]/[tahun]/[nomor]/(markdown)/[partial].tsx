import { HttpError, type RouteConfig } from "fresh";

import PeraturanIsi from "~/components/peraturan_isi.tsx";
import type { Peraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { createMarked, type PeraturanToken } from "~/utils/md.ts";
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
    "/:jenis/:tahun/:nomor/:partial(judul|pembukaan|konsideran|dasar-hukum|batang-tubuh)",
};

export const handler = define.handlers<Data>((ctx) => {
  const { jenis, tahun, nomor, partial } = ctx.params;
  const peraturan = ctx.state.peraturan as Peraturan;
  const md = ctx.state.md as string;
  const marked = createMarked();
  const rootTokens = marked.lexer(md);
  const breadcrumbs: { name: string; url?: string }[] = [
    ...peraturan.breadcrumbs,
  ];
  let tokens: PeraturanToken[] | undefined;
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
  if (!tokens || !tokens.length) throw new HttpError(404);
  const judulPartial = partial.split("-").map((word) =>
    word[0].toUpperCase() + word.substring(1)
  ).join(" ");
  breadcrumbs.push({ name: judulPartial });
  const html = marked.parser(tokens as PeraturanToken[]);
  ctx.state.seo = {
    title: `${judulPartial} | ${peraturan.rujukPanjang}`,
    description: ellipsis(
      `${tokens.map((token) => token.raw).join("\n")}`,
      155,
    ),
    image: `${ctx.url.origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = breadcrumbs;
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  const path = `/${jenis}/${tahun}/${nomor}`;
  return { data: { path, md, html } };
});

export default define.page<typeof handler>(({ data }) => (
  <PeraturanIsi {...data} />
));
