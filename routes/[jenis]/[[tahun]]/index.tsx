import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@/lib/db/mod.ts";
import {
  getFilterByJenisCount,
  getFilterByTahunCount,
  getListPeraturan,
  NAMA2_JENIS,
  Peraturan,
} from "@/models/peraturan.ts";
import { AppContext } from "@/utils/app_context.ts";
import Pagination from "@/components/pagination.tsx";

export const handler: Handler<ListPeraturanPageProps, AppContext> = async (
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
    <div className="row">
      <div className="d-lg-none my-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-toggle="offcanvas"
          data-bs-target="#filters"
          aria-label="Open Filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-funnel"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
          </svg>
          &nbsp;Saring
        </button>
      </div>
      <aside
        className="col-lg-3 col-xxl-2 offcanvas-start offcanvas-lg"
        id="filters"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            Saring Peraturan
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#filters"
            aria-label="Close Filters"
          >
          </button>
        </div>
        <div className="offcanvas-body flex-column">
          <FilterByJenis {...filterByJenisProps} />
          <FilterByTahun {...filterByTahunProps} />
        </div>
      </aside>
      <div className="col-12 col-xxl-10 col-lg-9 overflow-x-auto">
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
