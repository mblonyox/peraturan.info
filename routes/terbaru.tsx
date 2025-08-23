import { getDB } from "~/lib/db/mod.ts";
import {
  getListPeraturanByTanggal,
  getTanggalTerakhir,
  type Peraturan,
} from "~/models/peraturan.ts";
import { define } from "~/utils/define.ts";
import clsx from "clsx";

interface Data {
  tanggalDipilih: string;
  tanggalTerakhir: { tanggal: string; jumlah: number }[];
  listPeraturan: Peraturan[];
}

export const handler = define.handlers<Data>(async (ctx) => {
  const tanggalParam = ctx.url.searchParams.get("tanggal");
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
  if (
    !tanggalTerakhir.map(({ tanggal }) => tanggal).includes(tanggalDipilih)
  ) {
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
  return {
    data: {
      tanggalDipilih,
      tanggalTerakhir,
      listPeraturan,
    },
  };
});

export default define.page<typeof handler>(
  ({ data: { tanggalDipilih, tanggalTerakhir, listPeraturan } }) => (
    <div className="container">
      <h1>Peraturan Terbaru</h1>
      <p>
        Selalu <i>up-to-date</i>{" "}
        dengan Peraturan Perundang-undangan terbaru yang ditetapkan pada situs
        ini dengan layanan berlangganan gratis menggunakan <i>RSS Feed.</i>
      </p>
      <div className="join join-vertical md:join-horizontal w-full my-2">
        <a href="/atom.xml" className="join-item btn link flex-1 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-rss"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M5.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-3-8.5a1 1 0 0 1 1-1c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1 6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1-1-1z" />
          </svg>
          Atom
        </a>
        <a href="/rss.xml" className="join-item btn link flex-1 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-rss-fill"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1 0-2zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1 0-2zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
          RSS 2.0
        </a>
        <a href="/feed.json" className="join-item btn link flex-1 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-filetype-json"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM4.151 15.29a1.176 1.176 0 0 1-.111-.449h.764a.578.578 0 0 0 .255.384c.07.049.154.087.25.114.095.028.201.041.319.041.164 0 .301-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .084-.29.387.387 0 0 0-.152-.326c-.101-.08-.256-.144-.463-.193l-.618-.143a1.72 1.72 0 0 1-.539-.214 1.001 1.001 0 0 1-.352-.367 1.068 1.068 0 0 1-.123-.524c0-.244.064-.457.19-.639.128-.181.304-.322.528-.422.225-.1.484-.149.777-.149.304 0 .564.05.779.152.217.102.384.239.5.41.12.17.186.359.2.566h-.75a.56.56 0 0 0-.12-.258.624.624 0 0 0-.246-.181.923.923 0 0 0-.37-.068c-.216 0-.387.05-.512.152a.472.472 0 0 0-.185.384c0 .121.048.22.144.3a.97.97 0 0 0 .404.175l.621.143c.217.05.406.12.566.211a1 1 0 0 1 .375.358c.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Zm-3.104-.033a1.32 1.32 0 0 1-.082-.466h.764a.576.576 0 0 0 .074.27.499.499 0 0 0 .454.246c.19 0 .33-.055.422-.164.091-.11.137-.265.137-.466v-2.745h.791v2.725c0 .44-.119.774-.357 1.005-.237.23-.565.345-.985.345a1.59 1.59 0 0 1-.568-.094 1.145 1.145 0 0 1-.407-.266 1.14 1.14 0 0 1-.243-.39Zm9.091-1.585v.522c0 .256-.039.47-.117.641a.862.862 0 0 1-.322.387.877.877 0 0 1-.47.126.883.883 0 0 1-.47-.126.87.87 0 0 1-.32-.387 1.55 1.55 0 0 1-.117-.641v-.522c0-.258.039-.471.117-.641a.87.87 0 0 1 .32-.387.868.868 0 0 1 .47-.129c.177 0 .333.043.47.129a.862.862 0 0 1 .322.387c.078.17.117.383.117.641Zm.803.519v-.513c0-.377-.069-.701-.205-.973a1.46 1.46 0 0 0-.59-.63c-.253-.146-.559-.22-.916-.22-.356 0-.662.074-.92.22a1.441 1.441 0 0 0-.589.628c-.137.271-.205.596-.205.975v.513c0 .375.068.699.205.973.137.271.333.48.589.626.258.145.564.217.92.217.357 0 .663-.072.917-.217.256-.146.452-.355.589-.626.136-.274.205-.598.205-.973Zm1.29-.935v2.675h-.746v-3.999h.662l1.752 2.66h.032v-2.66h.75v4h-.656l-1.761-2.676h-.032Z"
            />
          </svg>
          JSON Feed
        </a>
      </div>
      <div className="tabs tabs-lift bg-base-200 rounded-box">
        {tanggalTerakhir.map(({ tanggal, jumlah }) => (
          <>
            <a
              role="tab"
              href={`?tanggal=${tanggal}`}
              className={clsx(
                "tab flex-1 z-1",
                tanggal === tanggalDipilih && "tab-active",
              )}
              aria-selected={tanggal === tanggalDipilih}
            >
              {new Date(tanggal).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              })} ({jumlah})
            </a>
            <div className="tab-content bg-base-100 border-base-300 rounded-t-none">
              {tanggal === tanggalDipilih && (
                <>
                  {!listPeraturan.length
                    ? (
                      <div className="alert alert-info" role="alert">
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
                                <a className="link" href={path}>
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
                </>
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  ),
);
