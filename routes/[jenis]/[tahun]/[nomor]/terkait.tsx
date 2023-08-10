import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@/data/db.ts";
import {
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  Peraturan,
  RelasiPeraturan,
} from "@/models/mod.ts";
import { AppContext } from "@/utils/app_context.tsx";

export const handler: Handler<TerkaitPeraturanPageProps, AppContext> = async (
  req,
  ctx,
) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const relasi1 = getRelasiPeraturan1(db, jenis, tahun, nomor);
  const relasi2 = getRelasiPeraturan2(db, jenis, tahun, nomor);
  const appContext: AppContext = {};
  appContext.seo = {
    title: `Peraturan Terkait | ${peraturan.rujukPanjang}`,
    description:
      `Peraturan Terkait (Dasar Hukum, Perubahan, Pencabutan, dll.) atas ${peraturan.rujukPanjang}`,
    image: `${new URL(req.url).origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  appContext.breadcrumbs = [...peraturan.breadcrumbs, {
    name: "Peraturan Terkait",
  }];
  appContext.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  return ctx.render({ relasi1, relasi2, appContext });
};

interface TerkaitPeraturanPageProps {
  relasi1: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
  relasi2: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
  appContext: AppContext;
}

export default function TerkaitPeraturanPage(
  {
    data: {
      relasi1,
      relasi2,
    },
  }: PageProps<
    TerkaitPeraturanPageProps
  >,
) {
  const itemsTerkait = [
    {
      title: "Dicabut dengan",
      items: relasi2.filter((r) => r.relasi === "cabut"),
    },
    {
      title: "Dicabut sebagian dengan",
      items: relasi2.filter((r) => r.relasi === "cabut_sebagian"),
    },
    {
      title: "Diubah dengan",
      items: relasi2.filter((r) => r.relasi === "ubah"),
    },
    {
      title: "Ditetapkan dengan",
      items: relasi2.filter((r) => r.relasi === "tetapkan"),
    },

    {
      title: "Menetapkan",
      items: relasi1.filter((r) => r.relasi === "tetapkan"),
    },

    { title: "Mencabut", items: relasi1.filter((r) => r.relasi === "cabut") },
    {
      title: "Mencabut sebagian",
      items: relasi1.filter((r) => r.relasi === "cabut_sebagian"),
    },
    { title: "Mengubah", items: relasi1.filter((r) => r.relasi === "ubah") },
    {
      title: "Dasar Hukum",
      items: relasi1.filter((r) => r.relasi === "dasar_hukum"),
    },
    {
      title: "Dijadikan Dasar Hukum berlakunya",
      items: relasi2.filter((r) => r.relasi === "dasar_hukum"),
    },
  ];

  return (
    <div className="row">
      {itemsTerkait.map(({ title, items }) => {
        if (!items.length) return;
        return (
          <div className="col-12 col-md-6 col-xxl-4">
            <h2>{title}:</h2>
            <ul>
              {items.map((
                { catatan, peraturan: { path, judul, rujukPendek } },
              ) => (
                <li>
                  <a
                    className="h6"
                    href={path}
                  >
                    {rujukPendek}
                  </a>
                  <p>{judul}</p>
                  {catatan && (
                    <p>
                      <em>{catatan}</em>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
