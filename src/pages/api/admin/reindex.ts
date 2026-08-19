import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { z } from "zod";

import { getListPeraturan } from "@/lib/db";
import { createCollection, indexDocuments } from "@/lib/typesense";

const payloadSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().min(10).max(100).optional().default(100),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== env.ADMIN_API_KEY) {
      return Response.json(
        { ok: false, error: "Invalid API key" },
        { status: 401 },
      );
    }
    const { page, pageSize } = payloadSchema.parse(await request.json());
    const encoder = new TextEncoder();
    let isClosed = false;
    let currentPage = page;
    const stream = new ReadableStream<string>({
      async start(controller) {
        try {
          await createCollection();
          controller.enqueue(`Starting reindex from page ${page}`);
        } catch (error: unknown) {
          isClosed = true;
          controller.enqueue(
            `Failed to create collection: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      },
      async pull(controller) {
        if (isClosed) return;
        try {
          const { hasil } = await getListPeraturan({
            page: currentPage,
            pageSize,
          });
          if (hasil.length === 0) {
            controller.close();
            return;
          }
          const documents = hasil
            .filter((p) => !isNaN(p.tanggal_ditetapkan as unknown as number))
            .map((p) => ({
              path: p.path,
              jenis: p.namaJenisPanjang,
              nomor: p.nomorPendek,
              judul: p.judul,
              tahun: p.tahun,
              tanggal: p.tanggal_ditetapkan.toISOString().split("T")[0],
            }))
            .filter((v) => v !== null);
          const response = await indexDocuments(documents);
          response.forEach((r) => {
            const message = `Peraturan ${r.id}; success: ${r.success}; error: ${r.error ?? ""};`;
            controller.enqueue(message);
          });
          currentPage++;
        } catch (error: unknown) {
          isClosed = true;
          controller.enqueue(
            `Failed to index documents: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      },
      cancel(reason) {
        isClosed = true;
        console.error("Streaming cancelled:", reason);
      },
    }).pipeThrough(
      new TransformStream<string, Uint8Array>({
        transform: (chunk, controller) =>
          controller.enqueue(encoder.encode(chunk + "\n")),
      }),
    );
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
