import { Handler, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { db } from "../../../../data/db.ts";
import { getPeraturan, Peraturan } from "../../../../models/peraturan.ts";
import { getNamaJenis } from "../../../../utils/const.ts";

export const handler: Handler<PeraturanPageProps> = (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  return ctx.render({ peraturan });
};

interface PeraturanPageProps {
  peraturan: Peraturan;
}

export default function PeraturanInfoPage(
  { data: { peraturan: { jenis, tahun, nomor, judul } } }: PageProps<
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
      <hgroup>
        <h1>{judul}</h1>
        <h2>
          {namaJenis} Nomor {nomor} Tahun {tahun} tentang {judul}
        </h2>
      </hgroup>
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
        </ul>
      </nav>
    </>
  );
}
