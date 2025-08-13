import { asset } from "fresh/runtime";

import PeraturanOutline from "~/components/peraturan_outline.tsx";
import PrintButton from "~/islands/print_button.tsx";

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
