import { marked } from "marked";
import { peraturan } from "@utils/md.ts";

interface PeraturanOutlineProps {
  md: string;
  path: string;
}

export default function PeraturanOutline(
  { md, path }: PeraturanOutlineProps,
) {
  marked.use(peraturan);
  const tokens = marked.lexer(md);
  const batangTubuh = tokens.filter((token: { type: string }) =>
    token.type === "buku" || token.type === "bab" || token.type === "pasal"
  );

  return (
    <ul className="list-group">
      <li className="list-group-item">JUDUL</li>
      <li className="list-group-item">PEMBUKAAN</li>
      <li className="list-group-item">
        BATANG TUBUH
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
    ? token.raw?.substring(judul.length, judul.length + 80)
    : (token.type === "ayat")
    ? token.raw?.substring(token.nomor.length, token.nomor.length + 80)
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
              <cite>{preview}{token.raw.length > 80 ? "…" : ""}</cite>}
          </div>
        )}
    </li>
  );
}
