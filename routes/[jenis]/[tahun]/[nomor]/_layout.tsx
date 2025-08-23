import { clsx } from "clsx";

import SocialShareButtons from "~/components/social_share_buttons.tsx";
import EmojiReactions from "~/islands/emoji_reactions.tsx";
import { kv } from "~/lib/kv/mod.ts";
import { getReaksi } from "~/models/reaksi.ts";
import { define } from "~/utils/define.ts";

export default define.layout(async (
  { Component, url, params, state },
) => {
  const path = url.pathname.split("/").at(-1);
  const { jenis, tahun, nomor } = params;
  const tabs = [
    {
      name: "Info",
      url: `/${jenis}/${tahun}/${nomor}/info`,
      isActive: path === "info",
      disabled: false,
    },
    {
      name: "Isi",
      url: `/${jenis}/${tahun}/${nomor}/isi`,
      isActive: path === "isi" || (path !== "info" && path !== "terkait"),
      disabled: false,
    },
    {
      name: "Terkait",
      url: `/${jenis}/${tahun}/${nomor}/terkait`,
      isActive: path === "terkait",
      disabled: false,
    },
  ];
  const counters = await getReaksi(kv, `/${jenis}/${tahun}/${nomor}`);

  return (
    <div className="container">
      <SocialShareButtons url={url} seo={state.seo} />
      <div className="tabs tabs-lift bg-base-200 rounded-box">
        {tabs.map(({ name, url, isActive, disabled }) => (
          <>
            <a
              role="tab"
              href={url}
              className={clsx(
                "tab flex-1 z-1",
                isActive && "tab-active",
                disabled && "tab-disabled",
              )}
              aria-selected={isActive}
              aria-disabled={disabled}
            >
              {name}
            </a>
            <div className="tab-content bg-base-100 border-base-300 p-2 rounded-t-none">
              {isActive && <Component />}
            </div>
          </>
        ))}
      </div>
      <EmojiReactions
        counters={counters}
        path={`/${jenis}/${tahun}/${nomor}`}
      />
    </div>
  );
});
