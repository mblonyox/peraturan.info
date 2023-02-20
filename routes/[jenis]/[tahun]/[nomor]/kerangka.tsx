import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanOutline from "@components/peraturan_outline.tsx";

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
  ctx.state.seo = {
    title: `Kerangka | ${peraturan.rujukPanjang}`,
    description:
      `Kerangka / Daftar Isi / Outline atas ${peraturan.rujukPanjang}.`,
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
  return (
    <PeraturanLayout activeTab="kerangka">
      <PeraturanOutline {...{ md, path }} />
    </PeraturanLayout>
  );
}
