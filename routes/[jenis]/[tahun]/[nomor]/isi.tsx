import { Handler, PageProps } from "$fresh/server.ts";
import { use } from "marked";
import { getDB } from "@/data/db.ts";
import { getPeraturan } from "@/models/mod.ts";
import { readTextMd } from "@/utils/fs.ts";
import { peraturan as peraturanExtension } from "@/utils/md.ts";
import PeraturanIsi from "@/components/peraturan_isi.tsx";

export const handler: Handler<IsiPeraturanPageData> = async (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  ctx.state.seo = {
    title: `Isi Peraturan | ${peraturan.rujukPanjang}`,
    description: `Isi Peraturan penuh atas ${peraturan.rujukPanjang}`,
    image: `${new URL(req.url).origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = [...peraturan.breadcrumbs, {
    name: "Isi Peraturan",
  }];
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  const path = `/${jenis}/${tahun}/${nomor}`;
  const marked = use(peraturanExtension);
  const html = await marked.parse(md);
  return ctx.render({ path, md, html });
};

interface IsiPeraturanPageData {
  path: string;
  md: string;
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
}

export default function IsiPeraturanPage(
  { data }: PageProps<IsiPeraturanPageData>,
) {
  return <PeraturanIsi {...data} />;
}
