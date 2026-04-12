import { z } from "zod";
import { notFound } from "next/navigation";
import { cache } from "react";

import Pagination from "@/components/pagination";
import {
  getDB,
  getFilterByJenisCount,
  getFilterByTahunCount,
  getListPeraturan,
  JENIS2_PERATURAN,
  NAMA2_JENIS,
} from "@/lib/db";
import { $pageLimit, $searchParams } from "@/utils/validate";

type Props = PageProps<"/[jenis]/[[...tahun]]">;

const paramsSchema = z.object({
  jenis: z.union([
    z.literal("all").transform(() => undefined),
    z.enum(JENIS2_PERATURAN),
  ]),
  tahun: z.tuple([z.string().regex(/\d{4}/)]).optional(),
});

const searchParamsSchema = $searchParams.pipe($pageLimit);

const getData = cache(async (props: Props) => {
  const res1 = await paramsSchema.safeParseAsync(await props.params);
  if (!res1.success) notFound();
  const jenis = res1.data.jenis;
  const tahun = res1.data.tahun?.[0];
  const res2 = await searchParamsSchema.safeParseAsync(
    await props.searchParams,
  );
  if (!res2.success) throw new Error("Invalid query." + res2.error);
  const page = res2.data.page;
  const pageSize = res2.data.limit;
  const db = await getDB();
  const listPeraturan = getListPeraturan(db, {
    jenis,
    tahun,
    page,
    pageSize,
  });
  if (!listPeraturan.hasil.length) notFound();
  const filterByJenis = getFilterByJenisCount(db, { jenis, tahun });
  const filterByTahun = getFilterByTahunCount(db, { jenis, tahun });
  const namaJenis = jenis ? NAMA2_JENIS[jenis].panjang : "semua peraturan";
  const judul = namaJenis + (tahun ? ` pada tahun ${tahun}` : "");
  const start = (page - 1) * pageSize + 1;
  const end = start + listPeraturan.hasil.length - 1;
  const range = `Menampilkan urutan ${
    start === end ? start : `${start} s.d. ${end}`
  } dari ${listPeraturan.total} peraturan.`;

  return {
    ...listPeraturan,
    filterByJenisProps: { data: filterByJenis, tahun },
    filterByTahunProps: { data: filterByTahun, jenis },
    judul,
    range,
  };
});

export async function generateMetadata(props: Props) {
  const { page, judul, range } = await getData(props);

  return {
    title: `Laman #${page} | Daftar ${judul}.`,
    description: `Tampilan daftar ${judul}. ${range}`,
  };
}

export default async function Page(props: Props) {
  const {
    page,
    pageSize,
    hasil,
    total,
    filterByJenisProps,
    filterByTahunProps,
  } = await getData(props);
  const startIndex = (page - 1) * pageSize + 1;

  return (
    <div className="drawer">
      <input id="filters" type="checkbox" className="drawer-toggle" hidden />
      <aside className="drawer-side">
        <label
          htmlFor="filters"
          aria-label="Close Filters"
          className="drawer-overlay"
        ></label>
        <div className="bg-base-100 min-h-screen p-5">
          <FilterByJenis {...filterByJenisProps} />
          <FilterByTahun {...filterByTahunProps} />
        </div>
      </aside>
      <div className="container drawer-content my-5">
        <div className="block lg:hidden my-2">
          <label htmlFor="filters" className="btn" aria-label="Open Filters">
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
          </label>
        </div>
        <div className="flex">
          <div className="hidden lg:block">
            <FilterByJenis {...filterByJenisProps} />
            <FilterByTahun {...filterByTahunProps} />
          </div>
          <div className="divider divider-horizontal hidden lg:flex"></div>
          <div className="flex-1 overflow-x-auto">
            <table className="table border-t-2 border-t-base-300">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Judul</th>
                  <th scope="col">Nomor dan Tahun</th>
                  <th scope="col">Bentuk</th>
                </tr>
              </thead>
              <tbody>
                {hasil.map(
                  ({ path, judul, nomorPendek, namaJenisPanjang }, index) => (
                    <tr key={judul + nomorPendek}>
                      <th scope="row">{startIndex + index}</th>
                      <td>{judul}</td>
                      <td>
                        <a className="link" href={path}>
                          {nomorPendek}
                        </a>
                      </td>
                      <td>{namaJenisPanjang}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <Pagination {...{ total, page, pageSize }} />
          </div>
        </div>
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
      <ul className="menu menu-vertical">
        <li>
          <a className="link" href={`/all/${tahun ?? ""}`}>
            Semua jenis
          </a>
        </li>
        {data.map(({ jenis, jumlah }) => (
          <li key={jenis}>
            <a className="link" href={`/${jenis}/${tahun ?? ""}`}>
              {NAMA2_JENIS[jenis].pendek}&nbsp;({jumlah})
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
      <div className="max-h-[50vh] overflow-auto">
        <ul className="menu menu-vertical">
          <li>
            <a className="link" href={`/${jenis ?? "all"}`}>
              Semua tahun
            </a>
          </li>
          {data.map(({ tahun, jumlah }) => (
            <li key={tahun}>
              <a className="link" href={`/${jenis ?? "all"}/${tahun}`}>
                {tahun}&nbsp;({jumlah})
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
