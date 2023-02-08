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
    token.type === "bab" || token.type === "pasal"
  );

  return (
    <ul>
      <li>JUDUL</li>
      <li>PEMBUKAAN</li>
      <li>
        BATANG TUBUH
        <ul>
          {batangTubuh.map((token) => (
            <BatangTubuhToken
              token={token}
              basePath={path}
              path={path}
            />
          ))}
        </ul>
      </li>
      <li>PENUTUP</li>
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
  path = (token.type === "bab" || token.type === "pasal" ? basePath : path) +
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
    <li>
      {subTokens?.length
        ? (
          <details open={token.type === "pasal"}>
            <summary>
              <a href={path}>{judul}</a>
            </summary>
            <ul>
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
          <>
            <a href={path}>
              {judul}
            </a>
            {preview &&
              <cite>{preview}{token.raw.length > 80 ? "…" : ""}</cite>}
          </>
        )}
    </li>
  );
}
