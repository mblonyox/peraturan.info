import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import { getNamaJenis } from "../utils/const.ts";
import { Peraturan } from "@models/peraturan.ts";
interface PeraturanLayoutProps {
  peraturan: Peraturan;
  activeTab: "kerangka" | "isi" | "info";
  kerangkaEnabled: boolean;
  isiEnabled: boolean;
  children: ComponentChildren;
}

export default function PeraturanLayout(
  {
    peraturan: { jenis, nomor, tahun, judul },
    activeTab,
    kerangkaEnabled,
    isiEnabled,
    children,
  }: PeraturanLayoutProps,
) {
  const namaJenis = getNamaJenis(jenis);
  const basePath = `/${jenis}/${tahun}/${nomor}`;

  return (
    <>
      <Head>
        <title>{judul}</title>
        <meta
          name="description"
          content={`${namaJenis} Nomor ${nomor} Tahun ${tahun} tentang ${judul}`}
        />
      </Head>

      <nav aria-label="breadcrumb">
        <ul>
          <li>
            <a href={`/${jenis}`}>{namaJenis}</a>
          </li>
          <li>
            <a
              href={basePath}
            >
              No. {nomor} Th. {tahun}
            </a>
          </li>
          <li>
            {activeTab === "info"
              ? "Informasi"
              : activeTab === "kerangka"
              ? "Kerangka (Outline)"
              : "Isi Peraturan"}
          </li>
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
          href={`${basePath}/daftar-isi`}
          class={activeTab === "kerangka" ? "" : "outline"}
          role="button"
          disabled={!kerangkaEnabled}
        >
          Kerangka
        </a>
        <a
          href={`${basePath}/daftar-isi`}
          class={activeTab === "isi" ? "" : "outline"}
          role="button"
          disabled={!isiEnabled}
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
