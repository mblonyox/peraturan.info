import { asset } from "$fresh/runtime.ts";
import { useCallback, useState } from "preact/hooks";

const createIframe = () => {
  const el = document.createElement("iframe");
  el.setAttribute("src", "about:blank");
  el.setAttribute(
    "style",
    "visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;",
  );
  el.setAttribute("width", "0");
  el.setAttribute("height", "0");
  el.setAttribute("wmode", "opaque");
  document.body.appendChild(el);
  return el;
};

const setElement = (iframe: HTMLIFrameElement, el: HTMLElement) => {
  const { contentWindow } = iframe;
  const doc = contentWindow!.document;
  doc.open();
  doc.write(
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body class="peraturan"></body></html>',
  );
  const cssLink = doc.createElement("link");
  cssLink.type = "text/css";
  cssLink.rel = "stylesheet";
  cssLink.href = asset("/peraturan.css");
  doc.head.appendChild(cssLink);
  doc.body.appendChild(el.cloneNode(true));
  doc.close();
  console.log(cssLink);
};

export default function PrintButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handler = useCallback(() => {
    const el = document.querySelector<HTMLElement>(".peraturan .kertas .isi");
    if (!el) return;
    if (isLoading) return;
    setIsLoading(true);
    const iframe = createIframe();
    setElement(iframe, el);
    const onClose = () => {
      document.body.removeChild(iframe);
      setIsLoading(false);
    };
    iframe.addEventListener("load", function () {
      this.contentWindow?.addEventListener(
        "afterprint",
        onClose,
      );
      this.contentWindow?.addEventListener(
        "beforeunload",
        onClose,
      );
      this.contentWindow?.focus();
      this.contentWindow?.print();
    });
  }, [isLoading]);

  return (
    <button className="btn btn-outline-secondary" onClick={handler}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-printer"
        viewBox="0 0 16 16"
      >
        <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
        <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
      </svg>{" "}
      Cetak
    </button>
  );
}
