import { Handler, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { db } from "../../../../data/db.ts";
import {
  getPeraturan,
  getSumberPeraturan,
  Peraturan,
} from "../../../../models/peraturan.ts";
import { getNamaJenis } from "../../../../utils/const.ts";

export const handler: Handler<PeraturanPageProps> = (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const sumber = getSumberPeraturan(db, jenis, tahun, nomor);
  return ctx.render({ peraturan, sumber });
};

interface PeraturanPageProps {
  peraturan: Peraturan;
  sumber: { nama: string; url_page: string; url_pdf: string }[];
}

export default function PeraturanInfoPage(
  {
    data: {
      peraturan: {
        jenis,
        tahun,
        nomor,
        judul,
        tanggal_ditetapkan,
        tanggal_diundangkan,
        tanggal_berlaku,
      },
      sumber,
    },
  }: PageProps<
    PeraturanPageProps
  >,
) {
  const namaJenis = getNamaJenis(jenis);

  return (
    <>
      <Head>
        <title>{judul}</title>
        <meta
          name="description"
          content={`${namaJenis} Nomor ${nomor} Tahun ${tahun} tentang ${judul}`}
        />
      </Head>
      <nav aria-label="breadcrumb">
        <ul>
          <li>
            <a href={`/${jenis}`}>{namaJenis}</a>
          </li>
          <li>
            <a
              href={`/${jenis}/${tahun}/${nomor}`}
            >
              No. {nomor} Th. {tahun}
            </a>
          </li>
          <li>
            <a
              href={`/${jenis}/${tahun}/${nomor}/info`}
            >
              Informasi
            </a>
          </li>
        </ul>
      </nav>
      <hgroup>
        <h1>{judul}</h1>
        <h2>
          {namaJenis} Nomor {nomor} Tahun {tahun}
        </h2>
      </hgroup>
      <div className="grid">
        <a
          href={`/${jenis}/${tahun}/${nomor}/daftar-isi`}
          class="outline"
          role="button"
          disabled
        >
          Daftar Isi
        </a>
        <a
          href={`/${jenis}/${tahun}/${nomor}/batang-tubuh`}
          class="outline"
          role="button"
          disabled
        >
          Batang Tubuh
        </a>
        <a
          href={`/${jenis}/${tahun}/${nomor}/lampiran`}
          class="outline"
          role="button"
          disabled
        >
          Lampiran
        </a>
        <a
          href={`/${jenis}/${tahun}/${nomor}/penjelasan`}
          class="outline"
          role="button"
          disabled
        >
          Penjelasan
        </a>
        <a href={`/${jenis}/${tahun}/${nomor}/info`} role="button">
          Informasi
        </a>
      </div>
      <article style={{ marginTop: "var(--spacing)" }}>
        <div className="grid">
          <div>
            <h3>Metadata</h3>
            <table>
              <tbody>
                <tr>
                  <td>Jenis</td>
                  <td>:</td>
                  <td>{namaJenis}</td>
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
                    {new Date(tanggal_ditetapkan).toLocaleDateString("id", {
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
                    {new Date(tanggal_diundangkan).toLocaleDateString("id", {
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
                    {new Date(tanggal_berlaku).toLocaleDateString("id", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>Abstrak</h3>
          </div>
          <div>
            <h3>Sumber</h3>
            {sumber.map(({ nama, url_page, url_pdf }, index) => (
              <details open={!index}>
                <summary role="button">{nama}</summary>
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
                    src={url_pdf}
                    style={{ width: "100%", aspectRatio: "1" }}
                  >
                  </iframe>
                )}
              </details>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
