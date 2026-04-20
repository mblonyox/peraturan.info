import Image from "next/image";

import { getPeraturanData, type Peraturan } from "../data";

type Props = PageProps<"/[jenis]/[tahun]/[nomor]/info">;

export async function generateMetadata({ params }: Props) {
  const { peraturan } = await getPeraturanData(await params);
  return {
    title: `Informasi | ${peraturan.rujukPanjang}`,
    description: `Informasi umum (Metadata, Sumber Peraturan, Abstrak) atas ${peraturan.rujukPanjang}`,
  };
}

export default async function Page(props: Props) {
  const { peraturan } = await getPeraturanData(await props.params);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <Metadata peraturan={peraturan} />
      <Preview peraturan={peraturan} />
    </div>
  );
}

function Metadata({ peraturan }: { peraturan: Peraturan }) {
  const {
    namaJenisPanjang,
    tahun,
    nomor,
    judul,
    tanggal_ditetapkan,
    tanggal_diundangkan,
    tanggal_berlaku,
  } = peraturan;
  return (
    <div>
      <h2 className="text-2xl mb-2">Metadata</h2>
      <table className="table table-zebra">
        <tbody>
          <tr>
            <td>Jenis</td>
            <td>:</td>
            <td>{namaJenisPanjang}</td>
          </tr>
          <tr>
            <td>Tahun</td>
            <td>:</td>
            <td>{tahun}</td>
          </tr>
          <tr>
            <td>Nomor</td>
            <td>:</td>
            <td>{nomor}</td>
          </tr>
          <tr>
            <td>Judul</td>
            <td>:</td>
            <td>{judul}</td>
          </tr>
          <tr>
            <td>Tanggal Ditetapkan</td>
            <td>:</td>
            <td>
              {tanggal_ditetapkan.toLocaleDateString("id", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
          </tr>
          <tr>
            <td>Tanggal Diundangkan</td>
            <td>:</td>
            <td>
              {tanggal_diundangkan.toLocaleDateString("id", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
          </tr>
          <tr>
            <td>Tanggal Berlaku</td>
            <td>:</td>
            <td>
              {tanggal_berlaku.toLocaleDateString("id", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Preview({ peraturan }: { peraturan: Peraturan }) {
  return (
    <div>
      <h2 className="text-2xl mb-2">Tampilan</h2>
      <Image
        src={peraturan.path + "/thumbnail.png"}
        alt={peraturan.rujukPendek}
        className="rounded-box w-full h-auto"
        width={360}
        height={0}
      />
    </div>
  );
}
