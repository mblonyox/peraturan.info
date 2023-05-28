import { Handler, PageProps } from "$fresh/server.ts";
import { AppContextState } from "@/utils/app_context.tsx";
import { getDB } from "@/data/db.ts";
import {
  getListPeraturanByTanggal,
  getTanggalTerakhir,
  Peraturan,
} from "@/models/peraturan.ts";
export const handler: Handler<TerbaruPageProps, AppContextState> = async (
  req,
  ctx,
) => {
  const tanggalParam = new URL(req.url).searchParams.get("tanggal");
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
    tanggalTerakhir.sort((a, b) => a.tanggal < b.tanggal ? 1 : -1);
  }
  const tanggalDipilihFmtd = new Date(tanggalDipilih).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
  ctx.state.seo = {
    title: `Peraturan Terbaru - ${tanggalDipilihFmtd}`,
    description:
      `Tampilan ${listPeraturan.length} peraturan terbaru yang diundangkan pada tanggal ${tanggalDipilihFmtd}`,
  };
  ctx.state.breadcrumbs = [{ name: "Peraturan Terbaru" }];
  return ctx.render({
    tanggalDipilih,
    tanggalTerakhir,
    listPeraturan,
  });
};

type TerbaruPageProps = {
  tanggalDipilih: string;
  tanggalTerakhir: { tanggal: string; jumlah: number }[];
  listPeraturan: Peraturan[];
};

export default function TerbaruPage(
  { data: { tanggalDipilih, tanggalTerakhir, listPeraturan } }: PageProps<
    TerbaruPageProps
  >,
) {
  return (
    <div>
      <h1>Peraturan Terbaru</h1>
      <p>
        Selalu <i>up-to-date</i>{" "}
        dengan Peraturan Perundang-undangan terbaru yang ditetapkan pada situs
        ini dengan layanan berlangganan gratis menggunakan <i>RSS Feed.</i>
      </p>
      <div className="card mb-2 mb-lg-3">
        <div className="card-header">
          <ul className="nav nav-tabs nav-fill card-header-tabs justify-content-around">
            {tanggalTerakhir.map(({ tanggal, jumlah }) => (
              <li className="nav-item">
                <a
                  href={`?tanggal=${tanggal}`}
                  className={"nav-link" +
                    (tanggal === tanggalDipilih ? " active" : "")}
                >
                  {new Date(tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  })} ({jumlah})
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body">
          {!listPeraturan.length
            ? (
              <div class="alert alert-info" role="alert">
                Tidak ada peraturan pada tanggal yang ditentukan.
              </div>
            )
            : (
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
                  {listPeraturan.map((
                    {
                      path,
                      judul,
                      nomorPendek,
                      namaJenisPanjang,
                    },
                    index,
                  ) => (
                    <tr key={judul}>
                      <th scope="row">{index + 1}</th>
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
            )}
        </div>
      </div>
    </div>
  );
}
