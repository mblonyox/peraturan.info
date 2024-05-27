import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@/lib/db/mod.ts";
import {
  getPeraturan,
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  getSumberPeraturan,
  Peraturan,
  RelasiPeraturan,
} from "@/models/mod.ts";
import { AppContext } from "@/utils/app_context.ts";

export const handler: Handler<InfoPeraturanPageProps, AppContext> = async (
  req,
  ctx,
) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const sumber = getSumberPeraturan(db, jenis, tahun, nomor);
  const relasi1 = getRelasiPeraturan1(db, jenis, tahun, nomor);
  const relasi2 = getRelasiPeraturan2(db, jenis, tahun, nomor);
  ctx.state.seo = {
    title: `Informasi | ${peraturan.rujukPanjang}`,
    description:
      `Informasi umum (Metadata, Sumber Peraturan, Abstrak) atas ${peraturan.rujukPanjang}`,
    image: `${new URL(req.url).origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = [...peraturan.breadcrumbs, { name: "Informasi" }];
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  return ctx.render({ peraturan, sumber, relasi1, relasi2 });
};

interface InfoPeraturanPageProps {
  peraturan: Peraturan;
  sumber: { nama: string; url_page: string; url_pdf: string }[];
  relasi1: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
  relasi2: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
}

export default function InfoPeraturanPage(
  {
    data: {
      peraturan,
      sumber,
      relasi1,
      relasi2,
    },
  }: PageProps<
    InfoPeraturanPageProps
  >,
) {
  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-6 col-xxl-4">
          <Metadata peraturan={peraturan} />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4">
          <h2>Tampilan</h2>
          <img
            src={peraturan.path + "/preview.png"}
            alt={peraturan.rujukPendek}
            className="img-thumbnail rounded"
          />
        </div>
        <div className="col-12 col-lg-6 col-xxl-4">
          <Sumber sumber={sumber} />
        </div>
      </div>
      <Relasi relasi1={relasi1} relasi2={relasi2} />
    </>
  );
}

function Metadata({ peraturan }: { peraturan: Peraturan }) {
  const {
    namaJenisPanjang,
    tahun,
    nomor,
    judul,
    tanggal_ditetapkan,
    tanggal_diundangkan,
    tanggal_berlaku,
  } = peraturan;
  return (
    <>
      <h2>Metadata</h2>
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>Jenis</td>
            <td>:</td>
            <td>{namaJenisPanjang}</td>
          </tr>
          <tr>
            <td>Tahun</td>
            <td>:</td>
            <td>{tahun}</td>
          </tr>
          <tr>
            <td>Nomor</td>
            <td>:</td>
            <td>{nomor}</td>
          </tr>
          <tr>
            <td>Judul</td>
            <td>:</td>
            <td>{judul}</td>
          </tr>
          <tr>
            <td>Tanggal Ditetapkan</td>
            <td>:</td>
            <td>
              {tanggal_ditetapkan.toLocaleDateString("id", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
          </tr>
          <tr>
            <td>Tanggal Diundangkan</td>
            <td>:</td>
            <td>
              {tanggal_diundangkan.toLocaleDateString("id", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
          </tr>
          <tr>
            <td>Tanggal Berlaku</td>
            <td>:</td>
            <td>
              {tanggal_berlaku.toLocaleDateString("id", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function Sumber(
  { sumber }: { sumber: { nama: string; url_page: string; url_pdf: string }[] },
) {
  return (
    <>
      <h2>Sumber</h2>
      <div className="accordion" id="accordion-sumber">
        {sumber.map(({ nama, url_page, url_pdf }, index) => (
          <div className="accordion-item">
            <h3 className="accordion-header" id={"heading-sumber-" + index}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={"#collapse-sumber-" + index}
                aria-expanded="false"
                aria-controls={"collapse-sumber-" + index}
              >
                {nama}
              </button>
            </h3>
            <div
              className="accordion-collapse collapse"
              id={"collapse-sumber-" + index}
              aria-labelledby={"heading-sumber-" + index}
              data-bs-parent="#accordion-sumber"
            >
              <div className="accordion-body">
                <p>
                  <a
                    href={url_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      width: "100%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {"🌐 "}
                    {url_page}
                  </a>
                </p>
                {url_pdf && (
                  <iframe
                    name={nama}
                    loading="lazy"
                    src={`https://docs.google.com/gview?url=${url_pdf}&embedded=true`}
                    style={{ width: "100%", aspectRatio: "1" }}
                  >
                  </iframe>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Relasi({ relasi1, relasi2 }: {
  relasi1: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
  relasi2: (Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
    peraturan: Peraturan;
  })[];
}) {
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
