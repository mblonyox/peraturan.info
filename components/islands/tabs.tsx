"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

interface Tab {
  path: string;
  name: string;
  disabled?: boolean;
}

interface Props {
  basePath: string;
  tabs: Tab[];
  children: React.ReactNode;
  defaultTab: string | number;
}

export default function Tabs({ tabs, children, defaultTab, basePath }: Props) {
  const activePath = useSelectedLayoutSegment();
  let activeTabIndex = tabs.findIndex(({ path }) => path === activePath);
  if (activeTabIndex < 0) {
    activeTabIndex =
      typeof defaultTab === "number"
        ? defaultTab
        : tabs.findIndex(({ path }) => path === defaultTab);
  }

  return (
    <div className="card card-border border">
      <div
        className="tabs tabs-lift bg-base-200 rounded-box rounded-b-none"
        role="tablist"
      >
        {tabs.map(({ name, path, disabled }, i) => {
          const isActive = i === activeTabIndex;
          return (
            <Link
              key={path}
              href={`${basePath}/${path}`}
              className={clsx(
                "tab flex-1 z-1",
                isActive && "tab-active",
                disabled && "tab-disabled",
              )}
              aria-selected={isActive}
              aria-disabled={disabled}
              role="tab"
            >
              {name}
            </Link>
          );
        })}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
