import "@/public/peraturan.css";

import { notFound } from "next/navigation";

import IconListNested from "@/components/icons/list-nested";
import IconWarning from "@/components/icons/warning";
import PrintButton from "@/components/print_button";
import { createMarked } from "@/lib/marked";

import { getPeraturanData } from "../data";
import { Nav, NavContextProvider } from "./nav";
import Outline from "./outline";

type Props = LayoutProps<"/[jenis]/[tahun]/[nomor]/[...partials]">;

export default async function Layout({ children, params }: Props) {
  const { jenis, tahun, nomor } = await params;
  const { peraturan, md } = await getPeraturanData({ jenis, tahun, nomor });
  if (!md) notFound();

  const tokens = createMarked().lexer(md);
  const outline = <Outline tokens={tokens} path={peraturan.path} />;

  return (
    <NavContextProvider>
      <div className="max-lg:drawer">
        <input id="outline" type="checkbox" className="drawer-toggle" hidden />
        <aside className="drawer-side lg:hidden">
          <label
            htmlFor="outline"
            aria-label="Close Outline"
            className="drawer-overlay"
          ></label>
          <div className="bg-base-100 p-5 w-1/2">{outline}</div>
        </aside>
        <div className="drawer-content">
          <div role="alert" className="alert alert-warning alert-soft">
            <IconWarning />
            <div>
              <h5 className="text-lg font-bold">Disclaimer</h5>
              <p>
                Dokumen peraturan ini ditampilkan sebagai hasil <i>parsing</i>{" "}
                semi-otomatis menggunakan teknologi OCR{"  "}
                <i>(Optical Character Recognition)</i>.
              </p>
              <p>
                Oleh karena itu, dimungkinkan terdapat perbedaan format,
                penulisan, maupun kekeliruan teks dari dokumen aslinya.
              </p>
              <p>
                Untuk keakuratan dan keabsahan, silakan merujuk pada dokumen
                resmi/sumber asli peraturan tersebut.
              </p>
            </div>
          </div>
          <div className="flex justify-between my-2">
            <label htmlFor="outline" className="btn btn-outline">
              <IconListNested />
              <span className="hidden md:inline">Outline</span>
            </label>
            <span className="text-center">
              <Nav basePath={peraturan.path} />
            </span>
            <PrintButton />
          </div>
          <div className="flex w-full">
            <div className="hidden lg:block max-w-1/4 2xl:max-w-1/5 max-h-[75vh] overflow-y-auto in-[&:has(#outline:checked)]:lg:hidden">
              {outline}
            </div>
            <div className="divider divider-horizontal hidden lg:flex in-[&:has(#outline:checked)]:lg:hidden" />
            <div className="flex-1 max-h-[75vh] overflow-y-auto">
              <div className="peraturan wadah">
                <div className="kertas">
                  <div className="isi">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavContextProvider>
  );
}
