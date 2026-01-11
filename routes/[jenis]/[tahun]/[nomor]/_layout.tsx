import Comments from "~/components/comments.tsx";
import SocialShareButtons from "~/components/social_share_buttons.tsx";
import { define } from "~/utils/define.ts";
import { clsx } from "clsx";

export default define.layout(({ Component, url, params, state }) => {
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

  return (
    <div className="container">
      <SocialShareButtons url={url} seo={state.seo} />
      <div className="card card-border border-1">
        <div
          className="tabs tabs-lift bg-base-200 rounded-box rounded-b-none"
          role="tablist"
        >
          {tabs.map(({ name, url, isActive, disabled }) => (
            <a
              href={url}
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
            </a>
          ))}
        </div>
        <div className="card-body">
          <Component />
        </div>
      </div>
      <Comments />
    </div>
  );
});
