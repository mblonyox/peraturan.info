import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { marked } from "marked";
import { peraturan as peraturanExtension } from "@utils/md.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import { getNamaJenis, SEO_DESCRIPTION, SEO_TITLE } from "@utils/const.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";
import SeoTags from "@components/seo_tags.tsx";

export const config: RouteConfig = {
  routeOverride: "/:jenis/:tahun/:nomor/:pasal(pasal-\\d+){/ayat-:ayat(\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor, pasal, ayat } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  marked.use(peraturanExtension);
  const tokens = marked.lexer(md);
  // deno-lint-ignore no-explicit-any
  const getPasal = (tokens: any[]): any[] =>
    tokens.map((token) =>
      token.type === "pasal" ? [token] : getPasal(token?.tokens ?? [])
    ).flat();
  const pasals = getPasal(tokens);
  let token;
  const breadcrumbs = [];
  // deno-lint-ignore no-explicit-any
  token = pasals.find((token: any) => {
    const slug = token?.nomor?.toLowerCase()?.replace(" ", "-");
    return slug === pasal;
  });
  if (ayat) {
    breadcrumbs.push({
      teks: token?.nomor,
      url: token?.nomor?.toLowerCase()?.replace(" ", "-"),
    });
    // deno-lint-ignore no-explicit-any
    token = token?.tokens?.find((token: any) => {
      const slug = token?.nomor?.toLowerCase()?.replaceAll(/[\(\)]/g, "");
      return token.type === "ayat" &&
        slug === ayat;
    });
  }
  breadcrumbs.push({
    teks: (token.type === "ayat" ? `ayat ` : "") + token?.nomor,
  });
  if (!token) return ctx.renderNotFound();
  const judulPartial = breadcrumbs.map(({ teks }) => teks).join(" ");
  const html = marked.parser([token as marked.Token]);
  return ctx.render({ peraturan, breadcrumbs, judulPartial, html });
};

interface PeraturanPartialPageProps {
  peraturan: Peraturan;
  breadcrumbs: { teks: string; url?: string }[];
  judulPartial: string;
  html: string;
}

export default function PeraturanPartialPage(
  {
    url,
    data: {
      peraturan,
      breadcrumbs,
      judulPartial,
      html,
    },
  }: PageProps<
    PeraturanPartialPageProps
  >,
) {
  const {
    jenis,
    tahun,
    nomor,
    judul,
  } = peraturan;
  const namaJenis = getNamaJenis(jenis);
  return (
    <PeraturanLayout
      {...{
        peraturan,
        breadcrumbs,
        activeTab: "isi",
        hasMd: true,
      }}
    >
      <SeoTags
        title={`${judulPartial} - ${namaJenis} ${judul} | ${SEO_TITLE}`}
        description={`${judulPartial} ${namaJenis} Nomor ${nomor} Tahun ${tahun} tentang ${judul}. ` +
          SEO_DESCRIPTION}
        url={url}
      />
      <PeraturanMarkdown html={html} />
    </PeraturanLayout>
  );
}
