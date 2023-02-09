import { useEffect, useState } from "preact/hooks";

export default function DarkModeToggler() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "light" || storedTheme === "dark" ||
      storedTheme === "system"
    ) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (
      theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) document.documentElement.setAttribute("data-bs-theme", "dark");
    else document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "🌟"}
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <button
            className={"dropdown-item d-flex justify-content-around" +
              (theme === "light" ? " active" : "")}
            type="button"
            onClick={() => setTheme("light")}
          >
            ☀️
            <div>
              Terang
            </div>
          </button>
        </li>
        <li>
          <button
            className={"dropdown-item d-flex justify-content-around" +
              (theme === "dark" ? " active" : "")}
            type="button"
            onClick={() => setTheme("dark")}
          >
            🌙
            <div>
              Gelap
            </div>
          </button>
        </li>
        <li>
          <button
            className={"dropdown-item d-flex justify-content-around" +
              (theme === "system" ? " active" : "")}
            type="button"
            onClick={() => setTheme("system")}
          >
            🌟
            <div>
              Sistem
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
}
