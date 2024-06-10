import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { createMarked, PeraturanToken } from "@/utils/md.ts";
import { getDB } from "@/lib/db/mod.ts";
import { getPeraturan } from "@/models/mod.ts";
import { readTextMd } from "@/utils/fs.ts";
import { ellipsis } from "@/utils/string.ts";
import PeraturanIsi from "@/components/peraturan_isi.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:jenis/:tahun/:nomor/:partial(judul|pembukaan|konsideran|dasar-hukum|batang-tubuh)",
};

export const handler: Handler<PeraturanPartialPageData> = async (
  req,
  ctx,
) => {
  const { jenis, tahun, nomor, partial } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
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
  const judulPartial = partial.split("-").map((word) =>
    word[0].toUpperCase() + word.substring(1)
  ).join(" ");
  breadcrumbs.push({ name: judulPartial });
  if (!tokens || !tokens.length) return ctx.renderNotFound();
  const html = marked.parser(tokens as PeraturanToken[]);
  ctx.state.seo = {
    title: `${judulPartial} | ${peraturan.rujukPanjang}`,
    description: ellipsis(
      `${tokens.map((token) => token.raw).join("\n")}`,
      155,
    ),
    image: `${new URL(req.url).origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = breadcrumbs;
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  const path = `/${jenis}/${tahun}/${nomor}`;
  return ctx.render({ path, md, html });
};

interface PeraturanPartialPageData {
  path: string;
  md: string;
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
}

export default function PeraturanPartialPage(
  {
    data,
  }: PageProps<
    PeraturanPartialPageData
  >,
) {
  return <PeraturanIsi {...data} />;
}
