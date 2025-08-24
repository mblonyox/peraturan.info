import PeraturanIsi from "~/components/peraturan_isi.tsx";
import type { Peraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { createMarked } from "~/utils/md.ts";

interface Data {
  path: string;
  md: string;
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
}

export const handler = define.handlers<Data>(async (ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const peraturan = ctx.state.peraturan as Peraturan;
  const md = ctx.state.md as string;
  ctx.state.seo = {
    title: `Isi Peraturan | ${peraturan.rujukPanjang}`,
    description: `Isi Peraturan penuh atas ${peraturan.rujukPanjang}`,
    image: `${ctx.url.origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs?.push({ name: "Isi Peraturan" });
  const path = `/${jenis}/${tahun}/${nomor}`;
  const marked = createMarked();
  const html = await marked.parse(md);
  return { data: { path, md, html } };
});

export default define.page<typeof handler>(({ data }) => (
  <PeraturanIsi {...data} />
));
