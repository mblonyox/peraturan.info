import { getDB } from "~/lib/db/mod.ts";
import {
  getRelasiPeraturan1,
  getRelasiPeraturan2,
  getSumberPeraturan,
  type Peraturan,
  type RelasiPeraturan,
} from "~/models/mod.ts";
import { define } from "~/utils/define.ts";

interface SumberItem {
  nama: string;
  url_page: string;
  url_pdf: string;
}

type RelasiItem = Pick<RelasiPeraturan, "id" | "relasi" | "catatan"> & {
  peraturan: Peraturan;
};

interface Data {
  sumber: SumberItem[];
  relasi1: RelasiItem[];
  relasi2: RelasiItem[];
}

export const handler = define.handlers<Data>(async (ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = ctx.state.peraturan as Peraturan;
  const sumber = getSumberPeraturan(db, jenis, tahun, nomor);
  const relasi1 = getRelasiPeraturan1(db, jenis, tahun, nomor);
  const relasi2 = getRelasiPeraturan2(db, jenis, tahun, nomor);
  ctx.state.seo = {
    title: `Terkait | ${peraturan.rujukPanjang}`,
    description:
      `Peraturan Terkait (Metadata, Sumber Peraturan, Abstrak) atas ${peraturan.rujukPanjang}`,
    image: `${ctx.url.origin}/${jenis}/${tahun}/${nomor}/image.png`,
  };
  ctx.state.breadcrumbs = [...peraturan.breadcrumbs, { name: "Terkait" }];
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  return { data: { sumber, relasi1, relasi2 } };
});

export default define.page<typeof handler>((
  { data: { sumber, relasi1, relasi2 } },
) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
    <Sumber items={sumber} />
    <Relasi relasi1={relasi1} relasi2={relasi2} />
  </div>
));

function Sumber({ items }: { items: SumberItem[] }) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl mb-2">Sumber</h2>
      <div className="w-full join join-vertical">
        {items.map(({ nama, url_page, url_pdf }) => (
          <div className="join-item collapse bg-base-100 border border-base-300">
            <input type="radio" name="sumber" />
            <div className="collapse-title">
              {nama}
            </div>
            <div className="collapse-content">
              <p>
                <a
                  href={url_page}
                  className="link inline-block w-full overflow-hidden overflow-ellipsis whitespace-nowrap"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"🌐 " + url_page}
                </a>
              </p>
              {url_pdf && (
                <iframe
                  name={nama}
                  loading="lazy"
                  src={`https://docs.google.com/gview?url=${url_pdf}&embedded=true`}
                  className="w-full aspect-square border border-base-300 rounded-box"
                >
                </iframe>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Relasi({ relasi1, relasi2 }: {
  relasi1: RelasiItem[];
  relasi2: RelasiItem[];
}) {
  const itemsTerkait = [
    {
      title: "Dicabut dengan",
      items: relasi2.filter((r) => r.relasi === "cabut"),
    },
    {
      title: "Dicabut sebagian dengan",
      items: relasi2.filter((r) => r.relasi === "cabut_sebagian"),
    },
    {
      title: "Diubah dengan",
      items: relasi2.filter((r) => r.relasi === "ubah"),
    },
    {
      title: "Ditetapkan dengan",
      items: relasi2.filter((r) => r.relasi === "tetapkan"),
    },

    {
      title: "Menetapkan",
      items: relasi1.filter((r) => r.relasi === "tetapkan"),
    },

    { title: "Mencabut", items: relasi1.filter((r) => r.relasi === "cabut") },
    {
      title: "Mencabut sebagian",
      items: relasi1.filter((r) => r.relasi === "cabut_sebagian"),
    },
    { title: "Mengubah", items: relasi1.filter((r) => r.relasi === "ubah") },
    {
      title: "Dasar Hukum",
      items: relasi1.filter((r) => r.relasi === "dasar_hukum"),
    },
    {
      title: "Dijadikan Dasar Hukum berlakunya",
      items: relasi2.filter((r) => r.relasi === "dasar_hukum"),
    },
  ];

  return (
    <>
      {itemsTerkait.filter((t) => t.items.length).map(
        ({ title, items }) => {
          return (
            <>
              <div>
                <h2 className="text-2xl mb-2">{title}</h2>
                <div className="list bg-base-100 border border-base-300 rounded-box max-h-[50vh] overflow-y-auto">
                  {items.map((
                    { catatan, peraturan: { path, judul, rujukPendek } },
                  ) => (
                    <div className="list-row">
                      <a className="link" href={path}>{rujukPendek}</a>
                      <p className="list-col-wrap">
                        {judul}
                        {catatan && (
                          <>
                            <br />
                            <em className="italic">{catatan}</em>
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        },
      )}
    </>
  );
}
