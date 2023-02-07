import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import { getNamaJenis, SEO_DESCRIPTION, SEO_TITLE } from "@utils/const.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";
import SeoTags from "@components/seo_tags.tsx";

export const handler: Handler<IsiPeraturanPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  return ctx.render({ peraturan, md });
};

interface IsiPeraturanPageProps {
  peraturan: Peraturan;
  md: string;
}

export default function IsiPeraturanPage(
  {
    url,
    data: {
      peraturan,
      md,
    },
  }: PageProps<
    IsiPeraturanPageProps
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
        breadcrumbs: [{ teks: "Isi peraturan." }],
        activeTab: "isi",
        hasMd: true,
      }}
    >
      <SeoTags
        title={`Isi Peraturan - ${namaJenis} ${judul} | ${SEO_TITLE}`}
        description={"Isi atau batang tubuh peraturan " +
          `${namaJenis} Nomor ${nomor} Tahun ${tahun} tentang ${judul}. ` +
          SEO_DESCRIPTION}
        url={url}
      />
      <PeraturanMarkdown md={md} />
    </PeraturanLayout>
  );
}
