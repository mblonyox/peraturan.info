import Comments from "@/components/comments";
import PageHeading from "@/components/page-heading";
import SocialShareButtons from "@/components/social_share_buttons";
import Tabs from "@/components/tabs";

import { getPeraturanData } from "./data";

type Props = LayoutProps<"/[jenis]/[tahun]/[nomor]">;

export { generateStaticParams } from "./data";

export async function generateMetadata(props: Props) {
  const { peraturan } = await getPeraturanData(await props.params);

  return {
    title: { template: `%s | ${peraturan.rujukPendek}` },
    description: peraturan.rujukPanjang,
  };
}

export default async function Layout({ children, params }: Props) {
  const { jenis, tahun, nomor } = await params;
  const tabs = [
    {
      name: "Info",
      path: "info",
      disabled: false,
    },
    {
      name: "Isi",
      path: "isi",
      disabled: false,
    },
    {
      name: "Terkait",
      path: "terkait",
      disabled: false,
    },
  ];
  const { peraturan } = await getPeraturanData({ jenis, tahun, nomor });

  return (
    <div className="container">
      <PageHeading
        title={peraturan.judul}
        description={peraturan.rujukPendek}
      />
      <SocialShareButtons />
      <Tabs basePath={`/${jenis}/${tahun}/${nomor}`} tabs={tabs} defaultTab={1}>
        {children}
      </Tabs>
      <Comments />
    </div>
  );
}
