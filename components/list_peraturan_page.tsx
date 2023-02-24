import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@/data/db.ts";
import {
  getFilterByJenisCount,
  getFilterByTahunCount,
  getListPeraturan,
  NAMA2_JENIS,
  Peraturan,
} from "@/models/peraturan.ts";
import { AppContextState } from "@/utils/app_context.tsx";
import Pagination from "./pagination.tsx";

export const handler: Handler<ListPeraturanPageProps, AppContextState> = async (
  req,
  ctx,
) => {
  const { jenis: kodeJenis, tahun } = ctx.params;
  const namaJenis = NAMA2_JENIS[kodeJenis]?.panjang ??
    (kodeJenis === "all" && "semua peraturan");
  if (kodeJenis !== "all" && !namaJenis) return ctx.renderNotFound();
  if (tahun?.length && (tahun?.length !== 4 || isNaN(parseInt(tahun)))) {
    return ctx.renderNotFound();
  }
  const searchParams = new URL(req.url).searchParams;
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10");

  const db = await getDB();
  const jenis = kodeJenis === "all" ? undefined : kodeJenis;
  const listPeraturan = getListPeraturan(db, { jenis, tahun, page, pageSize });
  const filterByJenis = getFilterByJenisCount(db, { jenis, tahun });
  const filterByTahun = getFilterByTahunCount(db, { jenis, tahun });

  const judul = (namaJenis || kodeJenis) + (
    tahun ? ` pada tahun ${tahun}` : ""
  );
  const range = listPeraturan.hasil.length
    ? `Menampilkan ${(page - 1) * pageSize + 1} s.d. ${
      (page - 1) * pageSize + listPeraturan.hasil.length
    } dari ${listPeraturan.total} peraturan.`
    : "";

  ctx.state.seo = {
    title: `Daftar ${judul}, halaman #${page}.`,
    description: `Tampilan daftar ${judul}. ${range}`,
  };

  ctx.state.breadcrumbs = [
    {
      name: (namaJenis || kodeJenis),
    },
  ];
  if (tahun) {
    ctx.state.breadcrumbs[0].url = `/${kodeJenis}`;
    ctx.state.breadcrumbs.push({ name: tahun });
  }

  ctx.state.pageHeading = {
    title: `Daftar Peraturan`,
    description: `${range}`,
  };

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
  data: {
    total,
    hasil,
    page,
    pageSize,
    filterByJenisProps,
    filterByTahunProps,
  },
}: PageProps<ListPeraturanPageProps>) {
  const startIndex = ((page - 1) * pageSize) + 1;

  return (
    <>
      <div className="row">
        <aside className="col-lg-3 col-xxl-2 d-none d-lg-block">
          <FilterByJenis {...filterByJenisProps} />
          <FilterByTahun {...filterByTahunProps} />
        </aside>
        <div className="col-12 col-xxl-10 col-lg-9">
          <table className="table table-striped border-top table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Judul</th>
                <th scope="col">Nomor dan Tahun</th>
                <th scope="col">Bentuk</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((
                {
                  path,
                  judul,
                  nomorPendek,
                  namaJenisPanjang,
                },
                index,
              ) => (
                <tr key={judul}>
                  <th scope="row">{startIndex + index}</th>
                  <td>
                    {judul}
                  </td>
                  <td>
                    <a href={path}>
                      {nomorPendek}
                    </a>
                  </td>
                  <td>
                    {namaJenisPanjang}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination {...{ total, page, pageSize }} />
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
