import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { BASE_URL } from "@/lib/constants";

export const alt = "Peraturan.Info";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "assets/logo.png"))
    .then((buffer) => buffer.toString("base64"))
    .then((base64) => `data:image/png;base64,${base64}`);

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
        src={logo}
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
          fontSize: 64,
          fontWeight: "bold",
          marginLeft: "10%",
          marginRight: "10%",
          color: "#ffffff",
        }}
      >
        Peraturan.Info
      </div>
      <div
        style={{
          fontSize: 32,
          marginLeft: "10%",
          marginRight: "10%",
          color: "#ffffff",
          lineClamp: 3,
        }}
      >
        Peraturan.Info adalah upaya untuk meningkatkan cara penyajian peraturan
        perundang-undangan di Indonesia sehingga lebih user-friendly yang
        terinspirasi dari legislation.gov.uk.
      </div>
      <div
        style={{
          alignSelf: "center",
          fontSize: 16,
          color: "#ffffff",
        }}
      >
        {BASE_URL}
      </div>
    </div>,
  );
}
