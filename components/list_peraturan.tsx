import { Peraturan } from "../models/peraturan.ts";
import { JENIS_PERATURAN } from "../utils/const.ts";
import Pagination from "./pagination.tsx";

export interface ListPeraturanProps {
  url: string;
  judul: string;
  total: number;
  hasil: Peraturan[];
  page: number;
  pageSize: number;
  filterByJenis: { jenis: string; jumlah: number }[];
  filterByTahun: { tahun: number; jumlah: number }[];
}

export default function ListPeraturan({
  url,
  judul,
  total,
  hasil,
  page,
  pageSize,
  filterByJenis,
  filterByTahun,
}: ListPeraturanProps) {
  return (
    <>
      <div id="info">
        <h1>Hasil Pencarian</h1>
        <p>
          Pencarian anda atas {judul} menemukan sebanyak {total} hasil.
        </p>
      </div>
      <Pagination {...{ url, total, page, pageSize }} />
      <div
        style={{
          display: "flex",
          columnGap: "var(--block-spacing-horizontal)",
        }}
      >
        <aside>
          <PeraturanByJenis data={filterByJenis} />
          <PeraturanByTahun data={filterByTahun} />
        </aside>
        <div id="hasil">
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
              {hasil.map(({ jenis, nomor, tahun, judul }, index) => (
                <tr key={judul}>
                  <th scope="row">{(page - 1) * pageSize + index + 1}</th>
                  <td>
                    <a href={`/${jenis}/${tahun}/${nomor}`}>{judul}</a>
                  </td>
                  <td>
                    <a href={`/${jenis}/${tahun}/${nomor}`}>
                      No.&nbsp;{nomor} Tahun&nbsp;{tahun}
                    </a>
                  </td>
                  <td>
                    {JENIS_PERATURAN.find((j) =>
                      j.kode === jenis
                    )?.nama}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

interface PeraturanByJenisProps {
  data: { jenis: string; jumlah: number }[];
}

function PeraturanByJenis({ data }: PeraturanByJenisProps) {
  return (
    <section>
      <p>Peraturan berdasar bentuk</p>
      <ul style={{ maxHeight: 480, overflowY: "auto" }}>
        <li>
          <a href="/all">Semua jenis</a>
        </li>
        {data.map(({ jenis, jumlah }) => (
          <li key={jenis}>
            <a href={`/${jenis}`}>
              {jenis}&nbsp;({jumlah})
            </a>
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
      <p>Peraturan berdasar tahun</p>
      <ul style={{ maxHeight: 480, overflowY: "auto" }}>
        <li>
          <a href="/all">Semua tahun</a>
        </li>
        {data.map(({ tahun, jumlah }) => (
          <li key={tahun}>
            <a href={`/all/${tahun}`}>
              {tahun}&nbsp;({jumlah})
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
