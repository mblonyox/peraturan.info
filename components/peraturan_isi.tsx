import { asset } from "fresh/runtime";

import PeraturanOutline from "~/components/peraturan_outline.tsx";
import PrintButton from "~/islands/print_button.tsx";
import PeraturanOutlineToggler from "~/islands/peraturan_outline_toggler.tsx";

type Props = {
  md: string;
  path: string;
  html: string;
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
};

export default function PeraturanIsi({ md, path, html, prev, next }: Props) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap"
        rel="stylesheet"
      />
      <link
        href={asset("/peraturan.css")}
        rel="stylesheet"
      />
      <div className="row vh-100">
        <div
          className="offcanvas offcanvas-start d-xl-none"
          id="outline-offcanvas"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">
              Kerangka Peraturan
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
            </button>
          </div>
          <div className="offcanvas-body">
            <PeraturanOutline md={md} path={path} />
          </div>
        </div>
        <div
          id="outline-sidenav"
          className="d-none d-xl-block col-xl-4 h-100 overflow-y-auto"
        >
          <PeraturanOutline md={md} path={path} />
        </div>
        <div className="col-12 col-xl-8 h-100 vstack gap-3">
          <div className="d-flex justify-content-between my-2">
            <PeraturanOutlineToggler />
            <span className="text-center">
              <a
                className={"btn btn-outline-secondary mx-2" +
                  (!prev ? " disabled" : "")}
                href={prev?.url}
              >
                &lt;&lt; {prev?.name}
              </a>
              <a
                className={"btn btn-outline-secondary mx-2" +
                  (!next ? " disabled" : "")}
                href={next?.url}
              >
                {next?.name} &gt;&gt;
              </a>
            </span>
            <PrintButton />
          </div>
          <div className="flex-fill overflow-y-auto">
            <div className="peraturan wadah">
              <div className="kertas">
                <div
                  className="isi"
                  // deno-lint-ignore react-no-danger
                  dangerouslySetInnerHTML={{ __html: html ?? "" }}
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
