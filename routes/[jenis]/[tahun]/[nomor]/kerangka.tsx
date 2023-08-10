import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@/data/db.ts";
import { getPeraturan, Peraturan } from "@/models/mod.ts";
import { AppContext } from "@/utils/app_context.ts";
import { readTextMd } from "@/utils/fs.ts";
import PeraturanOutline from "@/components/peraturan_outline.tsx";

export const handler: Handler<KerangkaPeraturanPageProps> = async (
  req,
  ctx,
) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  ctx.state.seo = {
    title: `Kerangka | ${peraturan.rujukPanjang}`,
    description:
      `Kerangka / Daftar Isi / Outline atas ${peraturan.rujukPanjang}.`,
    image: `${new URL(req.url).origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = [...peraturan.breadcrumbs, { name: "Kerangka" }];
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  return ctx.render({ peraturan, md });
};

interface KerangkaPeraturanPageProps {
  peraturan: Peraturan;
  md: string;
}

export default function KerangkaPeraturanPage(
  {
    data: {
      peraturan,
      md,
    },
  }: PageProps<
    KerangkaPeraturanPageProps
  >,
) {
  const {
    path,
  } = peraturan;
  return <PeraturanOutline {...{ md, path }} />;
}
