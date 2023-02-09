import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import { getNamaJenis } from "../utils/const.ts";
import { Peraturan } from "@models/peraturan.ts";
interface PeraturanLayoutProps {
  peraturan: Peraturan;
  breadcrumbs: { teks: string; url?: string }[];
  activeTab: "kerangka" | "isi" | "info";
  hasMd: boolean;
  children: ComponentChildren;
}

export default function PeraturanLayout(
  {
    peraturan: { jenis, nomor, tahun, judul },
    breadcrumbs,
    activeTab,
    hasMd,
    children,
  }: PeraturanLayoutProps,
) {
  const namaJenis = getNamaJenis(jenis);
  const basePath = `/${jenis}/${tahun}/${nomor}`;

  return (
    <div class="my-3 my-lg-5">
      <nav aria-label="breadcrumb">
        <ul class="breadcrumb">
          <li class="breadcrumb-item">
            <a href={`/${jenis}`}>{namaJenis}</a>
          </li>
          <li class="breadcrumb-item">
            <a href={`/${jenis}/${tahun}`}>{tahun}</a>
          </li>
          <li class="breadcrumb-item">
            <a
              href={basePath}
            >
              No. {nomor} Th. {tahun}
            </a>
          </li>
          {breadcrumbs.map(({ teks, url }) => (
            <li class={"breadcrumb-item" + (url ? "" : " active")}>
              {url ? <a href={basePath + "/" + url}>{teks}</a> : teks}
            </li>
          ))}
        </ul>
      </nav>
      <hgroup className="my-2 my-lg-3">
        <h1>{judul}</h1>
        <p>
          {namaJenis} Nomor {nomor} Tahun {tahun}
        </p>
      </hgroup>
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs justify-content-around">
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
