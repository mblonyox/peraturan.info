import { createCanvas } from "$canvas";
import { Handlers } from "$fresh/server.ts";
import { Document } from "@/lib/pdfium/mod.ts";

export const handler: Handlers = {
  GET: async (req, _ctx) => {
    const url = new URL(req.url).searchParams.get("url");
    if (!url) throw new Error("Parameter 'url' not provided.");
    const pdfData = await getPdfData(url);
    const imageData = getPdfFirstPageImage(pdfData);
    const png = convertImageData(imageData);
    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  },
};

async function getPdfData(url: string) {
  const data = await fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Invalid url: ${res.statusText}`);
    const contentType = res.headers.get("Content-Type");
    if (contentType !== "application/pdf") {
      throw new Error("Not a pdf document.");
    }
    return res.arrayBuffer();
  });
  return new Uint8Array(data);
}

function getPdfFirstPageImage(data: Uint8Array) {
  const doc = new Document(data);
  const page = doc.getPage(0);
  const imageData = page?.getImageData();
  page?.destroy();
  doc.destroy();
  if (!imageData) throw new Error("No Image found.");
  return imageData;
}

function convertImageData(
  imageData: ImageData,
) {
  const canvas = createCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer();
}
