import { ComponentChildren } from "preact";
import { getNamaJenis } from "@utils/const.ts";
import { Peraturan } from "@models/peraturan.ts";
interface PeraturanLayoutProps {
  peraturan: Peraturan;
  activeTab: "kerangka" | "isi" | "terkait" | "info";
  hasMd: boolean;
  children: ComponentChildren;
}

export default function PeraturanLayout(
  {
    peraturan: { jenis, nomor, tahun, judul },
    activeTab,
    hasMd,
    children,
  }: PeraturanLayoutProps,
) {
  const namaJenis = getNamaJenis(jenis);
  const basePath = `/${jenis}/${tahun}/${nomor}`;

  return (
    <div class="my-3 my-lg-5">
      <hgroup className="my-2 my-lg-3">
        <h1>{judul}</h1>
        <p>
          {namaJenis} Nomor {nomor} Tahun {tahun}
        </p>
      </hgroup>
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs nav-fill card-header-tabs justify-content-around">
            <li className="nav-item">
              <a
                href={`${basePath}/kerangka`}
                class={"nav-link" +
                  (activeTab === "kerangka" ? " active" : "") +
                  (!hasMd ? " disabled" : "")}
                disabled={!hasMd}
              >
                Kerangka
              </a>
            </li>
            <li className="nav-item">
              <a
                href={`${basePath}/isi`}
                class={"nav-link" + (activeTab === "isi" ? " active" : "") +
                  (!hasMd ? " disabled" : "")}
                disabled={!hasMd}
              >
                Isi
              </a>
            </li>
            <li className="nav-item">
              <a
                href={`${basePath}/terkait`}
                class={"nav-link" + (activeTab === "terkait" ? " active" : "")}
              >
                Terkait
              </a>
            </li>
            <li className="nav-item">
              <a
                href={`${basePath}/info`}
                class={"nav-link" + (activeTab === "info" ? " active" : "")}
              >
                Informasi
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {children}
        </div>
      </div>
    </div>
  );
}
