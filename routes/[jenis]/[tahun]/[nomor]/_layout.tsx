import Webmentions from "~/islands/webmentions.tsx";
import SocialShareButtons from "~/components/social_share_buttons.tsx";
import { define } from "~/utils/define.ts";
import { clsx } from "clsx";

export default define.layout((
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
      isActive: path !== "info",
      disabled: false,
    },
  ];
  return (
    <div className="container">
      <SocialShareButtons url={url} seo={state.seo} />
      <div className="tabs tabs-lift bg-base-200 p-2 rounded-box">
        {tabs.map(({ name, url, isActive, disabled }) => (
          <>
            <a
              role="tab"
              href={url}
              className={clsx(
                "tab flex-1",
                isActive && "tab-active",
                disabled && "tab-disabled",
              )}
            >
              {name}
            </a>
            {isActive &&
              (
                <div className="tab-content bg-base-100 border-base-300">
                  <Component />
                </div>
              )}
          </>
        ))}
      </div>
      <Webmentions url={url} />
    </div>
  );
});
