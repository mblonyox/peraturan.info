import { notFound } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import IconFunnel from "@/components/icons/funnel";
import PageHeading from "@/components/page-heading";
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
  if (!res2.success) notFound();
  const page = res2.data.page;
  const pageSize = res2.data.limit;
  const db = await getDB();
  const listPeraturan = await getListPeraturan(db, {
    jenis,
    tahun,
    page,
    pageSize,
  });
  if (!listPeraturan.hasil.length) notFound();
  const filterByJenis = await getFilterByJenisCount(db, { jenis, tahun });
  const filterByTahun = await getFilterByTahunCount(db, { jenis, tahun });
  const headingTitle =
    "Daftar " +
    (jenis ? NAMA2_JENIS[jenis].panjang : "semua peraturan") +
    (tahun ? ` pada tahun ${tahun}.` : ".");
  const start = (page - 1) * pageSize + 1;
  const end = start + listPeraturan.hasil.length - 1;
  const headingDescription = `Menampilkan urutan ${
    start === end ? start : `${start} s.d. ${end}`
  } dari ${listPeraturan.total} peraturan.`;

  return {
    ...listPeraturan,
    filterByJenisProps: { data: filterByJenis, tahun },
    filterByTahunProps: { data: filterByTahun, jenis },
    headingTitle,
    headingDescription,
  };
});

export async function generateMetadata(props: Props) {
  const { page, headingTitle, headingDescription } = await getData(props);

  return {
    title: `Laman #${page} | ${headingTitle}`,
    description: `Tampilan ${headingTitle} ${headingDescription}`,
  };
}

export default async function Page(props: Props) {
  const {
    page,
    pageSize,
    hasil,
    headingTitle,
    headingDescription,
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
      <div className="drawer-content">
        <PageHeading title={headingTitle} description={headingDescription} />
        <div className="container my-5">
          <div className="block lg:hidden my-2">
            <label htmlFor="filters" className="btn" aria-label="Open Filters">
              <IconFunnel />
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
    </div>
  );
}

interface FilterByJenisProps {
  data: Record<string, number>;
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
        {Object.entries(data)
          .sort(
            (a, b) =>
              JENIS2_PERATURAN.indexOf(a[0] as never) -
              JENIS2_PERATURAN.indexOf(b[0] as never),
          )
          .map(([jenis, jumlah]) => (
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
  data: Record<string, number>;
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
          {Object.entries(data)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([tahun, jumlah]) => (
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
