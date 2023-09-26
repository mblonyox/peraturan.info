import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@/data/db.ts";
import { getPeraturan, getSumberPeraturan, Peraturan } from "@/models/mod.ts";
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
  return ctx.render({ peraturan, sumber });
};

interface InfoPeraturanPageProps {
  peraturan: Peraturan;
  sumber: { nama: string; url_page: string; url_pdf: string }[];
}

export default function InfoPeraturanPage(
  {
    data: {
      peraturan,
      sumber,
    },
  }: PageProps<
    InfoPeraturanPageProps
  >,
) {
  return (
    <div className="row">
      <div className="col-12 col-lg-6 col-xxl-4">
        <Metadata peraturan={peraturan} />
      </div>
      <div className="col-12 col-lg-6 col-xxl-8">
        <Sumber sumber={sumber} />
      </div>
    </div>
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
