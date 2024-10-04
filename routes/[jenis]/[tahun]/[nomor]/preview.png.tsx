import { createCanvas } from "$canvas";
import { Handlers } from "$fresh/server.ts";
import { PDFiumLibrary, type PDFiumPageRenderOptions } from "@hyzyla/pdfium";
import { getDB } from "@/lib/db/mod.ts";
import { getSumberPeraturan } from "@/models/mod.ts";

export const handler: Handlers = {
  GET: async (_req, ctx) => {
    const { jenis, tahun, nomor } = ctx.params;
    const db = await getDB();
    const sumber = getSumberPeraturan(db, jenis, tahun, nomor);
    const url = sumber.at(0)?.url_pdf;
    if (!url) return ctx.renderNotFound();
    const pdfData = await getPdfData(url);
    const png = await getPdfFirstPageImage(pdfData);
    return new Response(png.data, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  },
};

async function getPdfData(url: string) {
  const data = await fetch(url).then(
    (res) => {
      if (!res.ok) throw new Error(`Invalid url: ${res.statusText}`);
      const contentType = res.headers.get("Content-Type");
      if (
        contentType !== "application/pdf" &&
        contentType !== "application/octet-stream"
      ) {
        throw new Error("Not a pdf document.");
      }
      return res.arrayBuffer();
    },
  );
  return new Uint8Array(data);
}

async function getPdfFirstPageImage(data: Uint8Array) {
  const pdfium = await PDFiumLibrary.init();
  const doc = await pdfium.loadDocument(data);
  const page = doc.getPage(0);
  const image = page.render({
    scale: 1,
    render: renderPage,
  });
  doc.destroy();
  return image;
}

function renderPage({ data, width, height }: PDFiumPageRenderOptions) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(width, height);
  data.forEach((v, i) => image.data[i] = v);
  ctx.putImageData(image, 0, 0);
  return Promise.resolve(canvas.toBuffer());
}
