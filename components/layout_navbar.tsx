"use client";

import { clsx } from "clsx";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import SearchInput from "@/components/islands/search_input";
import ThemeSwitcher from "@/components/islands/theme_switcher";
import IconMenu from "./icons/menu";
import IconArrowDown from "./icons/arrow-down";

const menus = [
  { href: "/", text: "Beranda" },
  { href: "/terbaru", text: "Terbaru" },
  {
    href: "#",
    text: "Peraturan",
    menu: [
      { href: "/uu", text: "Undang\u2011Undang" },
      { href: "/perppu", text: "Perppu" },
      { href: "/pp", text: "Peraturan\u00A0Pemerintah" },
      { href: "/perpres", text: "Peraturan\u00A0Presiden" },
      { href: "/permenkeu", text: "Peraturan\u00A0Menteri\u00A0Keuangan" },
    ],
  },
];

export default function LayoutNavbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar bg-base-200">
      <div className="navbar-start">
        <details className="flex-none lg:hidden dropdown">
          <summary aria-label="Show Menu" className="btn btn-square btn-ghost">
            <IconMenu />
          </summary>
          <ul className="menu dropdown-content bg-base-300 rounded-box z-1 p-2 shadow-2xl">
            {menus.map(({ href, text, menu }) => (
              <li key={text}>
                {menu ? (
                  <details open>
                    <summary>{text}</summary>
                    <ul>
                      {menu.map(({ href, text }) => (
                        <li key={text}>
                          <Link
                            href={href}
                            className={clsx(pathname === href && "menu-active")}
                            aria-current={pathname === href ? "page" : "false"}
                          >
                            {text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    href={href}
                    className={clsx(pathname === href && "menu-active")}
                    aria-current={pathname === href ? "page" : "false"}
                  >
                    {text}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </details>
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="Logo Peraturan.Info"
            width={32}
            height={32}
          />
        </Link>
        <ul className="hidden lg:flex menu menu-horizontal rounded-box gap-2">
          {menus.map(({ href, text, menu }) => (
            <li key={text}>
              {menu ? (
                <div className="dropdown dropdown-start">
                  <div tabIndex={0} role="button">
                    <span className="mx-1">{text}</span>
                    <IconArrowDown />
                  </div>
                  <ul
                    tabIndex={-1}
                    className="menu dropdown-content bg-base-300 rounded-box z-1 p-2 shadow-2xl"
                  >
                    {menu.map(({ href, text }) => (
                      <li key={text}>
                        <Link
                          href={href}
                          className={clsx(pathname === href && "menu-active")}
                          aria-current={pathname === href ? "page" : "false"}
                        >
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  href={href}
                  className={clsx(pathname === href && "menu-active")}
                  aria-current={pathname === href ? "page" : "false"}
                >
                  {text}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-center">
        <SearchInput />
      </div>
      <div className="navbar-end">
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
