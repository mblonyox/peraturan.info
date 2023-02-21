import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import {
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  Peraturan,
  RelasiPeraturan,
} from "@models/mod.ts";
import { existsMd } from "@utils/fs.ts";
import { AppContextState } from "@utils/app_context.tsx";
import PeraturanLayout from "@components/peraturan_layout.tsx";

export const handler: Handler<TerkaitPeraturanPageProps, AppContextState> =
  async (_req, ctx) => {
    const { jenis, tahun, nomor } = ctx.params;
    const db = await getDB();
    const peraturan = getPeraturan(db, jenis, tahun, nomor);
    if (!peraturan) return ctx.renderNotFound();
    const hasMd = await existsMd({ jenis, tahun, nomor });
    const relasi1 = getRelasiPeraturan1(db, jenis, tahun, nomor);
    const relasi2 = getRelasiPeraturan2(db, jenis, tahun, nomor);
    ctx.state.seo = {
      title: `Peraturan Terkait | ${peraturan.rujukPanjang}`,
      description:
        `Peraturan Terkait (Dasar Hukum, Perubahan, Pencabutan, dll.) atas ${peraturan.rujukPanjang}`,
    };
    ctx.state.breadcrumbs = [...peraturan.breadcrumbs, {
      name: "Peraturan Terkait",
    }];
    ctx.state.pageHeading = {
      title: peraturan.judul,
      description: peraturan.rujukPendek,
    };
    return ctx.render({ hasMd, relasi1, relasi2 });
  };

interface TerkaitPeraturanPageProps {
  hasMd: boolean;
  relasi1: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
  relasi2: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
}

export default function TerkaitPeraturanPage(
  {
    data: {
      hasMd,
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
    <PeraturanLayout
      activeTab="terkait"
      disabledTabs={!hasMd ? ["kerangka", "isi"] : []}
    >
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
    </PeraturanLayout>
  );
}
