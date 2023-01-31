import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";

export const handler: Handler<KerangkaPeraturanPageProps> = async (
  req,
  ctx,
) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  return ctx.render({ peraturan });
};

interface KerangkaPeraturanPageProps {
  peraturan: Peraturan;
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
        kerangkaEnabled: false,
        isiEnabled: false,
      }}
    >
    </PeraturanLayout>
  );
}
