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
  routeOverride:
    "/:jenis/:tahun/:nomor/:bab(bab-[mdclxvi]+){/:bagian(bagian-\\w+)}?{/:paragraf(paragraf-\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor, bab, bagian, paragraf } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  marked.use(peraturanExtension);
  const tokens = marked.lexer(md);
  const breadcrumbs = [];
  const juduls = [];
  let token: marked.Tokens.Generic | undefined;
  // deno-lint-ignore no-explicit-any
  token = tokens.find((token: any) => {
    const slug = token?.nomor?.toLowerCase()?.replace(" ", "-");
    return token.type === "bab" &&
      slug === bab;
  });
  if (bagian) {
    breadcrumbs.push({
      teks: token?.nomor,
      url: token?.nomor?.toLowerCase()?.replace(" ", "-"),
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
        teks: token?.nomor,
        url: breadcrumbs[0].url + "/" +
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
  if (!token) return ctx.renderNotFound();
  breadcrumbs.push({ teks: token?.nomor });
  juduls.push(token?.judul);
  const judulPartial = juduls.join(", ");
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
