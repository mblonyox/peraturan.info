import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";

export const handler: Handler<KerangkaPeraturanPageProps> = async (
  _req,
  ctx,
) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  return ctx.render({ peraturan, md });
};

interface KerangkaPeraturanPageProps {
  peraturan: Peraturan;
  md: string;
}

export default function KerangkaPeraturanPage(
  {
    data: {
      peraturan,
    },
  }: PageProps<
    KerangkaPeraturanPageProps
  >,
) {
  return (
    <PeraturanLayout
      {...{
        peraturan,
        activeTab: "kerangka",
        kerangkaEnabled: true,
        isiEnabled: true,
      }}
    >
    </PeraturanLayout>
  );
}
