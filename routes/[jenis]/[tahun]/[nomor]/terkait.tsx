import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import {
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  Peraturan,
  RelasiPeraturan,
} from "@models/peraturan.ts";
import { getNamaJenis, SEO_DESCRIPTION, SEO_TITLE } from "@utils/const.ts";
import { existsMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import SeoTags from "@components/seo_tags.tsx";

export const handler: Handler<TerkaitPeraturanPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const hasMd = await existsMd({ jenis, tahun, nomor });
  const relasi1 = getRelasiPeraturan1(db, jenis, tahun, nomor);
  const relasi2 = getRelasiPeraturan2(db, jenis, tahun, nomor);
  return ctx.render({ peraturan, hasMd, relasi1, relasi2 });
};

interface TerkaitPeraturanPageProps {
  peraturan: Peraturan;
  hasMd: boolean;
  relasi1: (RelasiPeraturan & Peraturan)[];
  relasi2: (RelasiPeraturan & Peraturan)[];
}

export default function TerkaitPeraturanPage(
  {
    url,
    data: {
      peraturan,
      hasMd,
      relasi1,
      relasi2,
    },
  }: PageProps<
    TerkaitPeraturanPageProps
  >,
) {
  const {
    jenis,
    tahun,
    nomor,
    judul,
  } = peraturan;
  const namaJenis = getNamaJenis(jenis);

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
  ];

  return (
    <PeraturanLayout
      {...{
        peraturan,
        breadcrumbs: [{ teks: "Peraturan Terkait" }],
        activeTab: "terkait",
        hasMd,
      }}
    >
      <SeoTags
        title={`Peraturan Terkait - ${namaJenis} ${judul} | ${SEO_TITLE}`}
        description={"Peraturan yang terkait dengan peraturan " +
          `${namaJenis} Nomor ${nomor} Tahun ${tahun} tentang ${judul}. ` +
          SEO_DESCRIPTION}
        url={url}
      />
      <div className="row">
        {itemsTerkait.map(({ title, items }) => {
          if (!items.length) return;
          return (
            <div className="col-12 col-md-6 col-xxl-4">
              <h2>{title}:</h2>
              <ul>
                {items.map((item) => (
                  <li>
                    <a
                      className="h6"
                      href={`/${item.jenis}/${item.tahun}/${item.nomor}`}
                    >
                      {getNamaJenis(item.jenis)} Nomor {item.nomor} Tahun{" "}
                      {item.tahun}
                    </a>
                    <p>{item.judul}</p>
                    {item.catatan && (
                      <p>
                        <em>{item.catatan}</em>
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
