import { Handler, PageProps } from "$fresh/server.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/peraturan.ts";
import { readTextMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";

export const handler: Handler<IsiPeraturanPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  return ctx.render({ peraturan, md });
};

interface IsiPeraturanPageProps {
  peraturan: Peraturan;
  md: string;
}

export default function IsiPeraturanPage(
  {
    data: {
      peraturan,
      md,
    },
  }: PageProps<
    IsiPeraturanPageProps
  >,
) {
  return (
    <PeraturanLayout
      {...{
        peraturan,
        activeTab: "isi",
        kerangkaEnabled: true,
        isiEnabled: true,
      }}
    >
      <PeraturanMarkdown md={md} />
    </PeraturanLayout>
  );
}
