import { defineLayout } from "$fresh/src/server/defines.ts";
import { existsMd } from "@/utils/fs.ts";
import Webmentions from "@/islands/webmentions.tsx";
import SocialShareButtons from "@/components/social_share_buttons.tsx";

export default defineLayout(async (
  _req,
  { Component, route, params },
) => {
  const path = route.split("/").at(-1);
  const { jenis, tahun, nomor } = params;
  const hasMd = await existsMd({ jenis, tahun, nomor });
  const tabs = [
    {
      name: "Kerangka",
      url: `/${jenis}/${tahun}/${nomor}/kerangka`,
      isActive: path === "kerangka",
      disabled: !hasMd,
    },
    {
      name: "Isi",
      url: `/${jenis}/${tahun}/${nomor}/isi`,
      isActive: path === "isi",
      disabled: !hasMd,
    },
    {
      name: "Terkait",
      url: `/${jenis}/${tahun}/${nomor}/terkait`,
      isActive: path === "terkait",
      disabled: false,
    },
    {
      name: "Info",
      url: `/${jenis}/${tahun}/${nomor}/info`,
      isActive: path === "info",
      disabled: false,
    },
  ] as const;
  return (
    <>
      <SocialShareButtons />
      <div className="card mb-2 mb-lg-3">
        <div className="card-header">
          <ul className="nav nav-tabs nav-fill card-header-tabs justify-content-around">
            {tabs.map(({ name, url, isActive, disabled }) => (
              <li className="nav-item">
                <a
                  href={url}
                  className={"nav-link" +
                    (isActive ? " active" : "") +
                    (disabled ? " disabled" : "")}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body">
          <Component />
        </div>
      </div>
      <Webmentions />
    </>
  );
});
