import { getPeraturanThumbnail } from "~/utils/data.ts";
import { define } from "~/utils/define.ts";

import { HttpError } from "fresh";

export const handler = define.handlers(async ({ params }) => {
  const { jenis, tahun, nomor } = params;
  const image = await getPeraturanThumbnail({ jenis, tahun, nomor });
  if (!image) throw new HttpError(404);
  return new Response(image, { headers: { "Content-Type": "image/png" } });
});
