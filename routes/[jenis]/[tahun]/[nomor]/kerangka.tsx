import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanOutline from "../../../../components/peraturan_outline.tsx";
import SeoTags from "../../../../components/seo_tags.tsx";
import {
  getNamaJenis,
  SEO_DESCRIPTION,
  SEO_TITLE,
} from "../../../../utils/const.ts";

export const handler: Handler<KerangkaPeraturanPageProps> = async (
  _req,
  ctx,
) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  return ctx.render({ peraturan, md });
};

interface KerangkaPeraturanPageProps {
  peraturan: Peraturan;
  md: string;
}

export default function KerangkaPeraturanPage(
  {
    url,
    data: {
      peraturan,
      md,
    },
  }: PageProps<
    KerangkaPeraturanPageProps
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
        breadcrumbs: [{ teks: "Kerangka" }],
        activeTab: "kerangka",
        hasMd: true,
      }}
    >
      <SeoTags
        title={`Kerangka Peraturan - ${namaJenis} ${judul} | ${SEO_TITLE}`}
        description={"Kerangka atau outline peraturan " +
          `${namaJenis} Nomor ${nomor} Tahun ${tahun} tentang ${judul}. ` +
          SEO_DESCRIPTION}
        url={url}
      />
      <PeraturanOutline md={md} path={`/${jenis}/${tahun}/${nomor}`} />
    </PeraturanLayout>
  );
}
