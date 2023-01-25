import Pagination from "./pagination.tsx";

interface HasilPencarianProps {
  kataKunci: string;
  total: number;
  hasil: {
    judul: string;
    nomorTahun: string;
    bentuk: string;
    link: string;
  }[];
  page: number;
  pageSize: number;
  byBentukProps?: PeraturanByBentukProps;
  byTahunProps?: PeraturanByTahunProps;
}

export default function HasilPencarian({
  kataKunci,
  total,
  hasil,
  page,
  pageSize,
  byBentukProps,
  byTahunProps,
}: HasilPencarianProps) {
  return (
    <div class="container">
      <div class="info">
        <h1>Hasil Pencarian</h1>
        <h2>
          Pencarian anda atas {kataKunci} menemukan sebanyak {total} hasil.
        </h2>
      </div>
      <aside>
        {byBentukProps && <PeraturanByBentuk {...byBentukProps} />}
        {byTahunProps && <PeraturanByTahun {...byTahunProps} />}
      </aside>
      <div className="hasil">
        <Pagination {...{ total, page, pageSize }} />
        <table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Judul</th>
              <th scope="col">Nomor dan Tahun</th>
              <th scope="col">Bentuk</th>
            </tr>
          </thead>
          <tbody>
            {hasil.map(({ judul, nomorTahun, bentuk, link }, index) => (
              <tr key={judul}>
                <th scope="row">{index + 1}</th>
                <td>
                  <a href={link}>{judul}</a>
                </td>
                <td>
                  <a href={link}>{nomorTahun}</a>
                </td>
                <td>{bentuk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PeraturanByBentukProps {
  data: { nama: string; jumlah: number }[];
}

function PeraturanByBentuk({ data }: PeraturanByBentukProps) {
  return (
    <section>
      <h3>Peraturan berdasar bentuk</h3>
      <ul>
        {data.map(({ nama, jumlah }) => (
          <li key={nama}>
            {nama} ({jumlah})
          </li>
        ))}
      </ul>
    </section>
  );
}

interface PeraturanByTahunProps {
  data: { tahun: number; jumlah: number }[];
}

function PeraturanByTahun({ data }: PeraturanByTahunProps) {
  return (
    <section>
      <h3>Peraturan berdasar tahun</h3>
      <ul>
        {data.map(({ tahun, jumlah }) => (
          <li key={tahun}>
            {tahun} ({jumlah})
          </li>
        ))}
      </ul>
    </section>
  );
}
