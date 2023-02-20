import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";

export const handler: Handler<IsiPeraturanPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  ctx.state.seo = {
    title: `Isi Peraturan | ${peraturan.rujukPanjang}`,
    description: `Isi Peraturan penuh atas ${peraturan.rujukPanjang}`,
  };
  ctx.state.breadcrumbs = [...peraturan.breadcrumbs, { name: "Isi Peraturan" }];
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  return ctx.render({ md });
};

interface IsiPeraturanPageProps {
  md: string;
}

export default function IsiPeraturanPage(
  {
    data: {
      md,
    },
  }: PageProps<
    IsiPeraturanPageProps
  >,
) {
  return (
    <PeraturanLayout activeTab="isi">
      <PeraturanMarkdown md={md} />
    </PeraturanLayout>
  );
}
