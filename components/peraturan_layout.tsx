import { ComponentChildren } from "preact";
import Webmentions from "@/islands/webmentions.tsx";
import ShareButtons from "@/islands/share_buttons.tsx";

const tabs = [
  { name: "kerangka", url: "./kerangka" },
  { name: "isi", url: "./isi" },
  { name: "terkait", url: "./terkait" },
  { name: "info", url: "./info" },
] as const;

type TabName = typeof tabs[number]["name"];
interface PeraturanLayoutProps {
  activeTab?: TabName;
  disabledTabs?: TabName[];
  children: ComponentChildren;
}

export default function PeraturanLayout(
  {
    activeTab,
    disabledTabs,
    children,
  }: PeraturanLayoutProps,
) {
  return (
    <>
      <ShareButtons />
      <div className="card mb-2 mb-lg-3">
        <div className="card-header">
          <ul className="nav nav-tabs nav-fill card-header-tabs justify-content-around">
            {tabs.map(({ name, url }) => (
              <li className="nav-item">
                <a
                  href={url}
                  className={"nav-link" +
                    (activeTab === name ? " active" : "") +
                    (disabledTabs?.includes(name) ? " disabled" : "")}
                  disabled={disabledTabs?.includes(name)}
                >
                  {name[0].toUpperCase() + name.substring(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body">
          {children}
        </div>
      </div>
      <Webmentions />
    </>
  );
}
