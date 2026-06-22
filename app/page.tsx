import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import IconBoxArrowUpRight from "@/components/icons/box-arrow-up-right";
import {
  getDB,
  getFeedListPeraturan,
  getPeraturan,
  getPopularPuu,
} from "@/lib/db";

export const dynamic = "force-dynamic";

function formatTanggal(date: Date) {
  return date.toLocaleDateString("ID-id", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const getData = unstable_cache(
  async () => {
    const db = await getDB();
    const feedList = await getFeedListPeraturan(db, 10);
    const terbaru = feedList.map((p) => ({
      tanggal: formatTanggal(p.tanggal_diundangkan),
      path: p?.path,
      nomor: p?.rujukPendek,
      judul: p?.judul,
    }));
    const results = await getPopularPuu(db, 5);
    const terpopuler = await Promise.all(
      results.map(async ({ path, count }) => {
        const [jenis, tahun, nomor] = path.split("/");
        const peraturan = await getPeraturan(db, { jenis, tahun, nomor });
        return {
          path: peraturan?.path ?? "/",
          nomor: peraturan?.rujukPendek ?? "Tidak ada nomor",
          judul: peraturan?.judul ?? "Tidak ada judul",
          count,
        };
      }),
    );

    return { terbaru, terpopuler };
  },
  [],
  {
    revalidate: 60 * 60 * 24,
    tags: ["home"],
  },
);

export default async function Home() {
  const { terbaru, terpopuler } = await getData();

  return (
    <>
      <div className="hero bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <Image
              src="/logo.webp"
              alt="Logo Peraturan.Info"
              className="mx-auto mb-5"
              width={256}
              height={256}
            />
            <h1 className="text-5xl font-bold mb-2">
              Peraturan<span className="text-neutral-500">.Info</span>
            </h1>
            <p className="mb-5">
              Peraturan.Info adalah upaya untuk meningkatkan cara penyajian
              peraturan perundang-undangan di Indonesia sehingga lebih
              user-friendly yang terinspirasi dari layanan{" "}
              <a
                href="https://legislation.gov.uk"
                target="_blank"
                rel="noreferrer noopener"
              >
                legislation.gov.uk
              </a>
              .
            </p>
            <Link href="/all" className="btn btn-primary">
              Lihat Semua Peraturan.
            </Link>
          </div>
        </div>
      </div>
      <div className="container flex flex-col lg:flex-row my-5">
        <ul className="list rounded-box bg-base-200 flex-1">
          <li className="p-4 pb-2 text-xl font-bold">Terbaru</li>
          {terbaru.slice(0, 5).map(({ path, nomor, judul, tanggal }) => (
            <li key={path} className="list-row">
              <div>
                <Image
                  className="h-auto rounded-xs"
                  src={`${path}/thumbnail.png`}
                  alt={judul}
                  width={64}
                  height={64}
                />
              </div>
              <div>
                <div className="text-xs">{tanggal}</div>
                <div className="font-semibold">{nomor}</div>
                <p className="text-sm">{judul}</p>
              </div>
              <Link href={path} target="_blank" className="btn btn-ghost">
                Lihat
                <IconBoxArrowUpRight />
              </Link>
            </li>
          ))}
        </ul>
        <div className="divider lg:divider-horizontal"></div>
        <ul className="list rounded-box bg-base-200 flex-1">
          <li className="p-4 pb-2 text-xl font-bold">Terpopuler</li>
          {terpopuler
            .slice(0, 5)
            .map(({ path, nomor, judul, count }, index) => (
              <li key={path} className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">
                  #{index + 1}
                </div>
                <div>
                  <div className="text-xs">{count} kali dilihat</div>
                  <div className="font-semibold">{nomor}</div>
                  <p className="text-sm">{judul}</p>
                </div>
                <Link
                  href={path ?? "#"}
                  target="_blank"
                  className="btn btn-ghost"
                >
                  Lihat
                  <IconBoxArrowUpRight />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
