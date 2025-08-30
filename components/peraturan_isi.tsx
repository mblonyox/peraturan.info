import PeraturanOutline from "~/components/peraturan_outline.tsx";
import PrintButton from "~/islands/print_button.tsx";
import { asset } from "fresh/runtime";

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
      <div className="max-lg:drawer">
        <input
          id="outline"
          type="checkbox"
          class="drawer-toggle"
        />
        <aside className="drawer-side lg:hidden">
          <label
            for="outline"
            aria-label="Close Outline"
            class="drawer-overlay"
          >
          </label>
          <div className="bg-base-100 p-5 w-1/2">
            <PeraturanOutline md={md} path={path} />
          </div>
        </aside>
        <div className="drawer-content">
          <div
            role="alert"
            className="alert alert-warning alert-soft"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h5 className="text-lg font-bold">Disclaimer</h5>
              <p>
                Dokumen peraturan ini ditampilkan sebagai hasil <i>parsing</i>
                {" "}
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
            <label
              htmlFor="outline"
              className="btn btn-outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-list-nested"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"
                />
              </svg>
              <span className="hidden md:inline">
                Outline
              </span>
            </label>
            <span className="text-center">
              {!prev
                ? (
                  <button
                    type="button"
                    disabled
                    className="btn btn-outline mx-2"
                  >
                    &lt;&lt;
                  </button>
                )
                : (
                  <a
                    className="btn btn-outline mx-2"
                    href={prev.url}
                  >
                    &lt;&lt;
                    <span className="hidden md:inline">
                      {prev.name}
                    </span>
                  </a>
                )}
              {!next
                ? (
                  <button
                    type="button"
                    disabled
                    className="btn btn-outline mx-2"
                  >
                    &gt;&gt;
                  </button>
                )
                : (
                  <a
                    className="btn btn-outline mx-2"
                    href={next.url}
                  >
                    &gt;&gt;
                    <span className="hidden md:inline">
                      {next.name}
                    </span>
                  </a>
                )}
            </span>
            <PrintButton />
          </div>
          <div className="flex w-full">
            <div className="hidden lg:block max-w-1/4 2xl:max-w-1/5 max-h-[75vh] overflow-y-auto in-[&:has(#outline:checked)]:lg:hidden">
              <PeraturanOutline md={md} path={path} />
            </div>
            <div className="divider divider-horizontal hidden lg:flex in-[&:has(#outline:checked)]:lg:hidden" />
            <div className="flex-1 max-h-[75vh] overflow-y-auto">
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
      </div>
      <script
        defer
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{
          __html:
            `document.querySelectorAll("details:has(a[aria-current='page'])").forEach((el) => el.open = true);`,
        }}
      >
      </script>
    </>
  );
}
