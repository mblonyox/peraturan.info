import { Handler, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getDB } from "@data/db.ts";
import {
  getPeraturan,
  getSumberPeraturan,
  Peraturan,
} from "@models/peraturan.ts";
import { getNamaJenis } from "@utils/const.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import { existsMd } from "../../../../utils/fs.ts";

export const handler: Handler<InfoPeraturanPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const isiEnabled = await existsMd({ jenis, tahun, nomor });
  const sumber = getSumberPeraturan(db, jenis, tahun, nomor);
  return ctx.render({ peraturan, isiEnabled, sumber });
};

interface InfoPeraturanPageProps {
  peraturan: Peraturan;
  isiEnabled: boolean;
  sumber: { nama: string; url_page: string; url_pdf: string }[];
}

export default function InfoPeraturanPage(
  {
    data: {
      peraturan,
      isiEnabled,
      sumber,
    },
  }: PageProps<
    InfoPeraturanPageProps
  >,
) {
  const {
    jenis,
    tahun,
    nomor,
    judul,
    tanggal_ditetapkan,
    tanggal_diundangkan,
    tanggal_berlaku,
  } = peraturan;
  const namaJenis = getNamaJenis(jenis);

  return (
    <PeraturanLayout
      {...{
        peraturan,
        activeTab: "info",
        kerangkaEnabled: false,
        isiEnabled,
      }}
    >
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
    </PeraturanLayout>
  );
}
