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
    <>
      <nav aria-label="breadcrumb">
        <ul>
          <li>
            <a href={`/${jenis}`}>{namaJenis}</a>
          </li>
          <li>
            <a href={`/${jenis}/${tahun}`}>{tahun}</a>
          </li>
          <li>
            <a
              href={basePath}
            >
              No. {nomor} Th. {tahun}
            </a>
          </li>
          {breadcrumbs.map(({ teks, url }) => (
            <li>{url ? <a href={basePath + "/" + url}>{teks}</a> : teks}</li>
          ))}
        </ul>
      </nav>
      <hgroup>
        <h1>{judul}</h1>
        <h2>
          {namaJenis} Nomor {nomor} Tahun {tahun}
        </h2>
      </hgroup>
      <div className="grid">
        <a
          href={`${basePath}/kerangka`}
          class={activeTab === "kerangka" ? "" : "outline"}
          role="button"
          disabled={!hasMd}
        >
          Kerangka
        </a>
        <a
          href={`${basePath}/isi`}
          class={activeTab === "isi" ? "" : "outline"}
          role="button"
          disabled={!hasMd}
        >
          Isi
        </a>
        <a
          href={`${basePath}/info`}
          class={activeTab === "info" ? "" : "outline"}
          role="button"
        >
          Informasi
        </a>
      </div>
      <article style={{ marginTop: "var(--spacing)" }}>
        {children}
      </article>
    </>
  );
}
