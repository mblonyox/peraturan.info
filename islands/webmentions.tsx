import { asset } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";

export default function Webmentions() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(document.URL);
  }, []);
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
          <div className="d-grid">
            <a
              href={`https://quill.p3k.io/?dontask=1&me=https://commentpara.de/&reply=${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Tulis tanggapan.
            </a>
          </div>
          <div id="webmentions"></div>
        </div>
      </div>
    </>
  );
}
