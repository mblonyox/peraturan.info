"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

import { JENIS2_PERATURAN, NAMA2_JENIS } from "@/lib/db";

import IconHouse from "./icons/house";

function formatPartials(segment: string): string {
  if (/^ayat/i.test(segment)) return `ayat (${segment.split("-")[1]})`;
  if (/^buku|bab/i.test(segment))
    return segment.replaceAll("-", " ").toLocaleUpperCase();
  return segment
    .split("-")
    .map((part) => part.charAt(0).toLocaleUpperCase() + part.slice(1))
    .join(" ");
}

function segmentsToBreadcrumbs(segments: string[]) {
  const breadcrumbs: { name: string; url: string }[] = [];
  let url = "";
  let jenis: string | undefined;
  let tahun: string | undefined;

  const segment1 = segments.at(0);
  url += `/${segment1}`;
  switch (segment1) {
    case "terbaru":
      breadcrumbs.push({ name: "Peraturan terbaru", url });
      break;
    case "search":
      breadcrumbs.push({ name: "Hasil Pencarian", url });
      break;
    case "all":
      breadcrumbs.push({ name: "Semua peraturan", url });
      break;
    default: {
      if (segment1 && JENIS2_PERATURAN.includes(segment1 as never)) {
        breadcrumbs.push({
          name: NAMA2_JENIS[segment1].panjang,
          url,
        });
        jenis = segment1;
      }
      break;
    }
  }

  const segment2 = segments.at(1);
  url += `/${segment2}`;
  if (segment2 && /^\d{4}$/.test(segment2)) {
    breadcrumbs.push({
      name: `Tahun ${segment2}`,
      url,
    });
    tahun = segment2;
  }

  const segment3 = segments.at(2);
  url += `/${segment3}`;
  if (jenis && tahun && segment3 && /^\d+$/.test(segment3)) {
    breadcrumbs.push({
      name: `${NAMA2_JENIS[jenis].pendek} No. ${segment3} Th. ${tahun}`,
      url,
    });
  }

  const segment4 = segments.at(3);
  for (const subSegment of segment4?.split("/") ?? []) {
    url += `/${subSegment}`;
    breadcrumbs.push({ name: formatPartials(subSegment), url });
  }

  return breadcrumbs;
}

export default function LayoutBreadcrumbs() {
  const segments = useSelectedLayoutSegments();

  if (segments.length === 0) {
    return null;
  }

  const breadcrumbs = segmentsToBreadcrumbs(segments);

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="breadcrumbs">
        <ul vocab="https://schema.org/" typeof="BreadcrumbList">
          <li>
            <Link href="/" property="item" typeof="WebPage">
              <IconHouse />
              <span property="name">Beranda</span>
            </Link>
            <meta property="position" content="1" />
          </li>
          {breadcrumbs.map(({ name, url }, index) => (
            <li key={index} property="itemListElement" typeof="ListItem">
              {url ? (
                <Link href={url} property="item" typeof="WebPage">
                  <span property="name">{name}</span>
                </Link>
              ) : (
                <span property="name">{name}</span>
              )}
              <meta property="position" content={`${index + 2}`} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
