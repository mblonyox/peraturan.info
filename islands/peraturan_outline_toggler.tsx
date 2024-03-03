import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect } from "preact/hooks";

export default function PeraturanOutlineToggler() {
  const onClickHandler = () => {
    const sidenav = document.getElementById("outline-sidenav");
    sidenav?.classList.toggle("d-xl-block");
  };
  useEffect(() => {
    if (!IS_BROWSER) return;
    document.querySelectorAll<HTMLDetailsElement>(
      "details:has(a[aria-current='page'])",
    ).forEach((el) => el.open = true);
  }, []);
  return (
    <>
      <a
        href="#outline-offcanvas"
        className="btn btn-outline-secondary d-xl-none"
        data-bs-toggle="offcanvas"
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
        </svg>{" "}
        Kerangka
      </a>
      <button
        className="btn btn-outline-secondary d-none d-xl-block"
        onClick={onClickHandler}
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
        </svg>{" "}
        Kerangka
      </button>
    </>
  );
}
