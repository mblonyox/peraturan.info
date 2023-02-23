import { marked } from "marked";
import { peraturan } from "@utils/md.ts";
import { ellipsis } from "@utils/string.ts";

interface PeraturanOutlineProps {
  md: string;
  path: string;
}

export default function PeraturanOutline(
  { md, path }: PeraturanOutlineProps,
) {
  marked.use(peraturan);
  const tokens = marked.lexer(md) as marked.Tokens.Generic[];
  const judul = tokens.find((token) => token.type === "judul");
  const konsideran = tokens.find((token) => token.type === "konsideran");
  const dasarHukum = tokens.find((token) => token.type === "dasar-hukum");
  const batangTubuh = tokens.filter((token) =>
    token.type === "buku" || token.type === "bab" || token.type === "pasal"
  );

  return (
    <ul className="list-group">
      <li className="list-group-item">
        <div className="d-flex flex-column gap-2">
          <a href={path + "/judul"}>
            JUDUL
          </a>
          <cite>{judul?.raw}</cite>
        </div>
      </li>
      <li className="list-group-item">
        <a href={path + "/pembukaan"}>
          PEMBUKAAN
        </a>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <details>
              <summary>
                <div className="d-inline-flex w-75 ms-2">
                  <a href={path + "/konsideran"}>Konsideran (Menimbang)</a>
                </div>
              </summary>
              <ul>
                {konsideran?.tokens?.map((token: marked.Tokens.Generic) =>
                  (token.type === "list" || token.type === "butir-list")
                    ? token.items
                    : (token.tokens ?? [token])
                ).flat().map(
                  (token) => <li>{ellipsis(token.raw)}</li>,
                )}
              </ul>
            </details>
          </li>
          <li className="list-group-item">
            <details>
              <summary>
                <div className="d-inline-flex w-75 ms-2">
                  <a href={path + "/konsideran"}>Dasar Hukum (Mengingat)</a>
                </div>
              </summary>
              <ul>
                {dasarHukum?.tokens?.map((token: marked.Tokens.Generic) =>
                  (token.type === "list" || token.type === "butir-list")
                    ? token.items
                    : (token.tokens ?? [token])
                ).flat().map(
                  (token) => <li>{ellipsis(token.raw)}</li>,
                )}
              </ul>
            </details>
          </li>
        </ul>
      </li>
      <li className="list-group-item">
        <a href={path + "/batang-tubuh"}>
          BATANG TUBUH
        </a>
        <ul className="list-group list-group-flush">
          {batangTubuh.map((token) => (
            <BatangTubuhToken
              token={token}
              basePath={path}
              path={path}
            />
          ))}
        </ul>
      </li>
      <li className="list-group-item">PENUTUP</li>
    </ul>
  );
}

function BatangTubuhToken(
  { token, basePath, path }: {
    token: marked.Tokens.Generic;
    basePath: string;
    path: string;
  },
) {
  const nomor = (token.type === "ayat" ? "ayat " : "") + token.nomor;
  const judul = token.judul || nomor;
  const slug = nomor.toLowerCase().replaceAll(" ", "-").replaceAll(
    /[\(\)]/g,
    "",
  );
  path = (token.type === "pasal" ? basePath : path) +
    `/${slug}`;
  const subTokens = token.tokens?.filter((token) =>
    ["bab", "bagian", "paragraf", "pasal", "ayat"].includes(token.type)
  );
  const preview = (token.type === "pasal" && !subTokens?.length)
    ? ellipsis(token.raw?.substring(judul.length))
    : (token.type === "ayat")
    ? ellipsis(token.raw?.substring(token.nomor.length))
    : "";
  return (
    <li className="list-group-item">
      {subTokens?.length
        ? (
          <details open={token.type === "pasal"}>
            <summary>
              <div className="d-inline-flex w-75 ms-2">
                <a href={path}>{judul}</a>
              </div>
            </summary>
            <ul className="list-group list-group-flush">
              {subTokens.map((token) => (
                <BatangTubuhToken
                  token={token}
                  basePath={basePath}
                  path={path}
                />
              ))}
            </ul>
          </details>
        )
        : (
          <div className="d-flex gap-2 w-100 ms-2">
            <a className="text-nowrap" href={path}>
              {judul}
            </a>
            {preview &&
              <cite>{preview}</cite>}
          </div>
        )}
    </li>
  );
}
