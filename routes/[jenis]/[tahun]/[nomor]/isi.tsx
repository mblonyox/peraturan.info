import { HttpError } from "fresh";

import PeraturanIsi from "~/components/peraturan_isi.tsx";
import { getDB } from "~/lib/db/mod.ts";
import { getPeraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { readTextMd } from "~/utils/fs.ts";
import { createMarked } from "~/utils/md.ts";

interface Data {
  path: string;
  md: string;
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
}

export const handler = define.handlers<Data>({
  GET: async (ctx) => {
    const { jenis, tahun, nomor } = ctx.params;
    const db = await getDB();
    const peraturan = getPeraturan(db, jenis, tahun, nomor);
    if (!peraturan) throw new HttpError(404);
    const md = await readTextMd({ jenis, tahun, nomor });
    if (!md) throw new HttpError(404);
    ctx.state.seo = {
      title: `Isi Peraturan | ${peraturan.rujukPanjang}`,
      description: `Isi Peraturan penuh atas ${peraturan.rujukPanjang}`,
      image: `${ctx.url.origin}/${jenis}/${tahun}/${nomor}/image.png`,
    };
    ctx.state.breadcrumbs = [...peraturan.breadcrumbs, {
      name: "Isi Peraturan",
    }];
    ctx.state.pageHeading = {
      title: peraturan.judul,
      description: peraturan.rujukPendek,
    };
    const path = `/${jenis}/${tahun}/${nomor}`;
    const marked = createMarked();
    const html = await marked.parse(md);
    return { data: { path, md, html } };
  },
});

export default define.page<typeof handler>(
  ({ data }) => <PeraturanIsi {...data} />,
);
