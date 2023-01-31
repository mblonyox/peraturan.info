import { Handler, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Peraturan } from "../models/peraturan.ts";
import { JENIS_PERATURAN } from "../utils/const.ts";
import Pagination from "./pagination.tsx";

import {
  getFilterByJenisCount,
  getFilterByTahunCount,
  getListPeraturan,
} from "../models/peraturan.ts";
import { getNamaJenis } from "../utils/const.ts";
import { getDB } from "../data/db.ts";

export const handler: Handler<ListPeraturanPageProps> = async (req, ctx) => {
  const { jenis: kodeJenis, tahun } = ctx.params;
  const namaJenis = getNamaJenis(kodeJenis);
  if (kodeJenis !== "all" && !namaJenis) return ctx.renderNotFound();
  if (tahun?.length && (tahun?.length !== 4 || isNaN(parseInt(tahun)))) {
    return ctx.renderNotFound();
  }
  const searchParams = new URL(req.url).searchParams;
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10");

  const judul =
    (kodeJenis === "all" ? "semua peraturan" : (namaJenis ?? kodeJenis)) + (
      tahun ? ` pada tahun ${tahun}` : ""
    );

  const db = await getDB();

  const jenis = kodeJenis === "all" ? undefined : kodeJenis;
  const listPeraturan = getListPeraturan(db, { jenis, tahun, page, pageSize });
  const filterByJenis = getFilterByJenisCount(db, { jenis, tahun });
  const filterByTahun = getFilterByTahunCount(db, { jenis, tahun });

  return ctx.render({
    judul,
    ...listPeraturan,
    filterByJenis,
    filterByTahun,
  });
};

interface ListPeraturanPageProps {
  judul: string;
  total: number;
  hasil: Peraturan[];
  page: number;
  pageSize: number;
  filterByJenis: { jenis: string; jumlah: number }[];
  filterByTahun: { tahun: number; jumlah: number }[];
}

export default function ListPeraturanPage({
  url,
  data: {
    judul,
    total,
    hasil,
    page,
    pageSize,
    filterByJenis,
    filterByTahun,
  },
}: PageProps<ListPeraturanPageProps>) {
  return (
    <>
      <Head>
        <title>{judul}</title>
      </Head>
      <div id="info">
        <h1>Hasil Pencarian</h1>
        <p>
          Pencarian anda atas {judul} menemukan sebanyak {total} hasil.
        </p>
      </div>
      <Pagination {...{ url, total, page, pageSize }} />
      <div
        style={{
          display: "flex",
          columnGap: "var(--block-spacing-horizontal)",
        }}
      >
        <aside>
          <PeraturanByJenis data={filterByJenis} />
          <PeraturanByTahun data={filterByTahun} />
        </aside>
        <div id="hasil">
          <table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Judul</th>
                <th scope="col">Nomor dan Tahun</th>
                <th scope="col">Bentuk</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map(({ jenis, nomor, tahun, judul }, index) => (
                <tr key={judul}>
                  <th scope="row">{(page - 1) * pageSize + index + 1}</th>
                  <td>
                    <a href={`/${jenis}/${tahun}/${nomor}`}>{judul}</a>
                  </td>
                  <td>
                    <a href={`/${jenis}/${tahun}/${nomor}`}>
                      No.&nbsp;{nomor} Tahun&nbsp;{tahun}
                    </a>
                  </td>
                  <td>
                    {JENIS_PERATURAN.find((j) =>
                      j.kode === jenis
                    )?.nama}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

interface PeraturanByJenisProps {
  data: { jenis: string; jumlah: number }[];
}

function PeraturanByJenis({ data }: PeraturanByJenisProps) {
  return (
    <section>
      <p>Peraturan berdasar bentuk</p>
      <ul style={{ maxHeight: 480, overflowY: "auto" }}>
        <li>
          <a href="/all">Semua jenis</a>
        </li>
        {data.map(({ jenis, jumlah }) => (
          <li key={jenis}>
            <a href={`/${jenis}`}>
              {jenis}&nbsp;({jumlah})
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface PeraturanByTahunProps {
  data: { tahun: number; jumlah: number }[];
}

function PeraturanByTahun({ data }: PeraturanByTahunProps) {
  return (
    <section>
      <p>Peraturan berdasar tahun</p>
      <ul style={{ maxHeight: 480, overflowY: "auto" }}>
        <li>
          <a href="/all">Semua tahun</a>
        </li>
        {data.map(({ tahun, jumlah }) => (
          <li key={tahun}>
            <a href={`/all/${tahun}`}>
              {tahun}&nbsp;({jumlah})
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
