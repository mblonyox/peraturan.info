"use client";

import { useCallback } from "react";

import IconPrinter from "./icons/printer";

export default function PrintButton() {
  const onClickHandler = useCallback(async () => {
    const printd = await import("printd");
    const d = new printd.Printd();
    const el = document.querySelector(".peraturan");
    if (!el) return;
    d.print(el as HTMLElement, ["/peraturan.css"]);
  }, []);

  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={onClickHandler}
      aria-label="Cetak"
    >
      <IconPrinter />
      <span className="hidden md:inline">Cetak</span>
    </button>
  );
}
