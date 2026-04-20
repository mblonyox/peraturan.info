import clsx from "clsx";
import Link from "next/link";
import { cache } from "react";

import IconFileJson from "@/components/icons/file-json";
import IconRssFill from "@/components/icons/rss-fill";
import IconRssLine from "@/components/icons/rss-line";
import { getDB, getListPeraturanByTanggal, getTanggalTerakhir } from "@/lib/db";

type Props = PageProps<"/terbaru">;

const getData = cache(async (props: Props) => {
  const searchParams = await props.searchParams;
  let tanggalParam = searchParams.tanggal;
  if (Array.isArray(tanggalParam)) {
    tanggalParam = tanggalParam.at(-1);
  }
  if (tanggalParam) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(tanggalParam) ||
      isNaN(Date.parse(tanggalParam))
    ) {
      throw new Error("Tanggal tidak valid.");
    }
  }
  const db = await getDB();
  const tanggalTerakhir = getTanggalTerakhir(db);
  const tanggalDipilih = tanggalParam ?? tanggalTerakhir.at(0)!.tanggal;
  const listPeraturan = getListPeraturanByTanggal(db, tanggalDipilih);
  if (!tanggalTerakhir.map(({ tanggal }) => tanggal).includes(tanggalDipilih)) {
    tanggalTerakhir.push({
      tanggal: tanggalDipilih,
      jumlah: listPeraturan.length,
    });
    tanggalTerakhir.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
  }

  return { tanggalDipilih, tanggalTerakhir, listPeraturan };
});

export async function generateMetadata(props: PageProps<"/terbaru">) {
  const { tanggalDipilih, listPeraturan } = await getData(props);
  const tanggalDipilihFmtd = new Date(tanggalDipilih).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return {
    title: `Peraturan Terbaru - ${tanggalDipilihFmtd}`,
    description: `Tampilan ${listPeraturan.length} peraturan terbaru yang diundangkan pada tanggal ${tanggalDipilihFmtd}`,
  };
}

export default async function Page(props: PageProps<"/terbaru">) {
  const { tanggalDipilih, tanggalTerakhir, listPeraturan } =
    await getData(props);
  return (
    <div className="container">
      <h1>Peraturan Terbaru</h1>
      <p>
        Selalu <i>up-to-date</i> dengan Peraturan Perundang-undangan terbaru
        yang ditetapkan pada situs ini dengan layanan berlangganan gratis
        menggunakan <i>RSS Feed.</i>
      </p>
      <div className="join join-vertical md:join-horizontal w-full my-2">
        <Link href="/atom.xml" className="join-item btn link flex-1 p-2">
          <IconRssLine />
          Atom
        </Link>
        <Link href="/rss.xml" className="join-item btn link flex-1 p-2">
          <IconRssFill />
          RSS 2.0
        </Link>
        <Link href="/feed.json" className="join-item btn link flex-1 p-2">
          <IconFileJson />
          JSON Feed
        </Link>
      </div>
      <div className="card card-border">
        <div
          role="tablist"
          className="tabs tabs-border bg-base-200 rounded-box rounded-b-none"
        >
          {tanggalTerakhir.map(({ tanggal, jumlah }) => (
            <Link
              key={tanggal}
              role="tab"
              href={`/terbaru?tanggal=${tanggal}`}
              className={clsx(
                "tab flex-1 z-1 text-nowrap",
                tanggal === tanggalDipilih ? "tab-active" : "tab-inactive",
              )}
              aria-selected={tanggal === tanggalDipilih}
            >
              {new Date(tanggal).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              })}{" "}
              ({jumlah})
            </Link>
          ))}
        </div>
        <div className="card-body">
          {!listPeraturan.length ? (
            <div className="alert alert-info" role="alert">
              Tidak ada peraturan pada tanggal yang ditentukan.
            </div>
          ) : (
            <table className="table table-striped table-responsive table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Judul</th>
                  <th scope="col">Nomor dan Tahun</th>
                  <th scope="col">Bentuk</th>
                </tr>
              </thead>
              <tbody>
                {listPeraturan.map(
                  ({ path, judul, nomorPendek, namaJenisPanjang }, index) => (
                    <tr key={judul}>
                      <th scope="row">{index + 1}</th>
                      <td>{judul}</td>
                      <td>
                        <Link className="link" href={path}>
                          {nomorPendek}
                        </Link>
                      </td>
                      <td>{namaJenisPanjang}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
