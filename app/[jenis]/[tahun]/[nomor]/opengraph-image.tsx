import { ImageResponse } from "next/og";

import logoDataUrl from "@/assets/logo.png";
import { ellipsis } from "@/utils/string";

import { getPeraturanData } from "./data";

type Props = {
  params: Promise<{
    jenis: string;
    tahun: string;
    nomor: string;
  }>;
};

export default async function Image({ params }: Props) {
  const { peraturan } = await getPeraturanData(await params);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-around",
        background: "linear-gradient(to left, #212529, #343a40, #2b3035)",
      }}
    >
      <img
        src={logoDataUrl.src}
        alt=""
        style={{
          width: 256,
          height: 256,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
      <div
        style={{
          marginLeft: "10%",
          marginRight: "10%",
          fontSize: 32,
          fontWeight: "bold",
          color: "#ffffff",
          lineClamp: 3,
        }}
      >
        {ellipsis(peraturan.judul, 200)}
      </div>
      <div
        style={{
          fontSize: 48,
          marginLeft: "10%",
          marginRight: "10%",
          color: "#ffffff",
        }}
      >
        {peraturan.rujukPendek}
      </div>
      <div
        style={{
          alignSelf: "center",
          fontSize: 16,
          color: "#ffffff",
        }}
      >
        {new URL(peraturan.path, `https://peraturan.info`).href}
      </div>
    </div>,
  );
}
