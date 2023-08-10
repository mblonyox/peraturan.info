import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@/data/db.ts";
import { getPeraturan } from "@/models/mod.ts";
import { AppContext } from "@/utils/app_context.tsx";
import { readTextMd } from "@/utils/fs.ts";
import PeraturanMarkdown from "@/components/peraturan_markdown.tsx";

export const handler: Handler<IsiPeraturanPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  const appContext: AppContext = {};
  appContext.seo = {
    title: `Isi Peraturan | ${peraturan.rujukPanjang}`,
    description: `Isi Peraturan penuh atas ${peraturan.rujukPanjang}`,
    image: `${new URL(req.url).origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  appContext.breadcrumbs = [...peraturan.breadcrumbs, {
    name: "Isi Peraturan",
  }];
  appContext.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  return ctx.render({ md, appContext });
};

interface IsiPeraturanPageProps {
  md: string;
  appContext: AppContext;
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
  return <PeraturanMarkdown md={md} />;
}
