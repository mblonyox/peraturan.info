import { Handler, PageProps } from "$fresh/server.ts";
import { Peraturan } from "@models/peraturan.ts";
import { JENIS_PERATURAN, SEO_DESCRIPTION, SEO_TITLE } from "@utils/const.ts";
import Pagination from "./pagination.tsx";
import SeoTags from "./seo_tags.tsx";

import {
  getFilterByJenisCount,
  getFilterByTahunCount,
  getListPeraturan,
} from "@models/peraturan.ts";
import { getNamaJenis } from "@utils/const.ts";
import { getDB } from "@data/db.ts";

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
    filterByJenisProps: { data: filterByJenis, tahun },
    filterByTahunProps: { data: filterByTahun, jenis },
  });
};

interface ListPeraturanPageProps {
  judul: string;
  total: number;
  hasil: Peraturan[];
  page: number;
  pageSize: number;
  filterByJenisProps: FilterByJenisProps;
  filterByTahunProps: FilterByTahunProps;
}

export default function ListPeraturanPage({
  url,
  data: {
    judul,
    total,
    hasil,
    page,
    pageSize,
    filterByJenisProps,
    filterByTahunProps,
  },
}: PageProps<ListPeraturanPageProps>) {
  return (
    <>
      <SeoTags
        title={`Hasil pencarian ${judul}, halaman ${page} | ${SEO_TITLE}`}
        description={`Pencarian anda atas ${judul} menemukan sebanyak ${total} hasil. ${SEO_DESCRIPTION}`}
        url={url}
      />
      <div class="my-3 my-lg-5">
        <h1>Hasil Pencarian</h1>
        <p>
          Pencarian anda atas {judul} menemukan sebanyak {total} hasil.
        </p>
      </div>
      <div class="row">
        <aside class="col-lg-3 col-xxl-2 d-none d-lg-block">
          <FilterByJenis {...filterByJenisProps} />
          <FilterByTahun {...filterByTahunProps} />
        </aside>
        <div class="col-12 col-xxl-10 col-lg-9">
          <table class="table table-striped border-top table-hover">
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
          </table>{" "}
          <Pagination {...{ url, total, page, pageSize }} />
        </div>
      </div>
    </>
  );
}

interface FilterByJenisProps {
  data: { jenis: string; jumlah: number }[];
  tahun?: string;
}

function FilterByJenis({ data, tahun }: FilterByJenisProps) {
  return (
    <section>
      <p>Saring berdasar jenis</p>
      <ul style={{ maxHeight: 480, overflowY: "auto" }}>
        <li>
          <a href={`/all/${tahun ?? ""}`}>Semua jenis</a>
        </li>
        {data.map(({ jenis, jumlah }) => (
          <li key={jenis}>
            <a href={`/${jenis}/${tahun ?? ""}`}>
              {jenis}&nbsp;({jumlah})
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface FilterByTahunProps {
  data: { tahun: number; jumlah: number }[];
  jenis?: string;
}

function FilterByTahun({ data, jenis }: FilterByTahunProps) {
  return (
    <section>
      <p>Saring berdasar tahun</p>
      <ul style={{ maxHeight: 480, overflowY: "auto" }}>
        <li>
          <a href={`/${jenis ?? "all"}`}>Semua tahun</a>
        </li>
        {data.map(({ tahun, jumlah }) => (
          <li key={tahun}>
            <a href={`/${jenis ?? "all"}/${tahun}`}>
              {tahun}&nbsp;({jumlah})
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
