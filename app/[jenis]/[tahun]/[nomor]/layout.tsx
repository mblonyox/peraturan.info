import { notFound } from "next/navigation";

import Comments from "@/components/comments";
import PageHeading from "@/components/page-heading";
import SocialShareButtons from "@/components/social_share_buttons";
import Tabs from "@/components/tabs";

import { getPeraturanData } from "./data";

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

type Props = LayoutProps<"/[jenis]/[tahun]/[nomor]">;

export async function generateMetadata(props: Props) {
  const peraturan = await getPeraturanData(await props.params);
  if (!peraturan) notFound();

  return {
    title: { template: `%s | ${peraturan.rujukPendek}` },
    description: peraturan.rujukPanjang,
  };
}

export default async function Layout({ children, params }: Props) {
  const { jenis, tahun, nomor } = await params;
  const peraturan = await getPeraturanData({ jenis, tahun, nomor });
  if (!peraturan) notFound();

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
