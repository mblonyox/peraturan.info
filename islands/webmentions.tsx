import { asset } from "$fresh/runtime.ts";

export default function LayoutWebmentions() {
  return (
    <>
      <link rel="stylesheet" href={asset("/styles/webmention.css")} />
      <script src={asset("/scripts/webmention.min.js")} async />
      <div className="card">
        <div className="card-body">
          <h2 className="card-tittle">Webmentions</h2>
          <p className="card-text">
            Anda dapat memberikan tanggapan atas peraturan ini dengan{" "}
            <i>like</i>, <i>retweet/repost</i> pada <i>tweet</i>{" "}
            yang mencantumkan tautan pada laman ini.
          </p>
          <div id="webmentions"></div>
        </div>
      </div>
    </>
  );
}
