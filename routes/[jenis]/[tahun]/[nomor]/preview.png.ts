import { PDFiumLibrary } from "@hyzyla/pdfium";
import { fromFileUrl } from "@std/path";
import { getDB } from "~/lib/db/mod.ts";
import { getSumberPeraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { createCanvas } from "$canvas";
import { HttpError } from "fresh";

const wasmBinary = import.meta.env.DEV
  ? undefined
  : Deno.readFileSync(fromFileUrl(import.meta.resolve("./pdfium.wasm"))).buffer;

export const handler = define.handlers({
  GET: async ({ params, url }) => {
    const cache = await caches.open("preview");
    const cachedContent = await cache.match(url);
    if (cachedContent) return cachedContent;
    const { jenis, tahun, nomor } = params;
    const db = await getDB();
    const sumber = getSumberPeraturan(db, jenis, tahun, nomor);
    const urlPdf = sumber.at(0)?.url_pdf;
    if (!urlPdf) throw new HttpError(404);
    const pdfData = await getPdfData(urlPdf);
    const png = await getPdfFirstPageImage(pdfData);
    const response = new Response(png.data.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
    cache.put(url, response.clone()).catch(() => null);
    return response;
  },
});

async function getPdfData(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Invalid url: ${res.statusText}`);
  const contentType = res.headers.get("Content-Type");
  if (
    contentType !== "application/pdf" &&
    contentType !== "application/octet-stream"
  ) throw new Error("Not a pdf document.");
  const data = await res.arrayBuffer();
  return new Uint8Array(data);
}

async function getPdfFirstPageImage(data: Uint8Array) {
  const pdfium = await PDFiumLibrary.init({ wasmBinary });
  const doc = await pdfium.loadDocument(data);
  const page = doc.getPage(0);
  const image = page.render({
    scale: 1,
    render: ({ data, width, height }) => {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      const image = ctx.createImageData(width, height);
      data.forEach((v, i) => image.data[i] = v);
      ctx.putImageData(image, 0, 0);
      return Promise.resolve(canvas.toBuffer());
    },
  });
  doc.destroy();
  pdfium.destroy();
  return image;
}
