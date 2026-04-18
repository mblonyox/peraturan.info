import type { Token } from "marked";
import Link from "next/link";

import { ellipsis } from "@/utils/string";

interface Props {
  tokens: Token[];
  path: string;
}

function childTokens(token?: Token) {
  return token && "tokens" in token ? token.tokens : undefined;
}

export default function Outline({ tokens, path }: Props) {
  const judul = tokens.find((token) => token.type === "judul");
  const konsideran = tokens.find((token) => token.type === "konsideran");
  const dasarHukum = tokens.find((token) => token.type === "dasar-hukum");
  const batangTubuh = tokens.filter(
    (token) =>
      token.type === "buku" || token.type === "bab" || token.type === "pasal",
  );

  return (
    <ul className="menu w-full bg-base-200 border border-base-300 rounded-box">
      <li>
        <div className="flex flex-col gap-2">
          <Link href={path + "/judul"}>JUDUL</Link>
          <cite>{judul?.raw}</cite>
        </div>
      </li>
      <li>
        <Link href={path + "/pembukaan"}>PEMBUKAAN</Link>
        <ul>
          <li>
            <details>
              <summary>
                <Link href={path + "/konsideran"}>Konsideran (Menimbang)</Link>
              </summary>
              <ul>
                {childTokens(konsideran)
                  ?.flatMap((token) =>
                    token.type === "list" || token.type === "butir-list"
                      ? token.items
                      : (childTokens(token) ?? [token]),
                  )
                  ?.map((token) => (
                    <li key={token.raw}>
                      <span>{ellipsis(token.raw)}</span>
                    </li>
                  ))}
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>
                <Link href={path + "/dasar-hukum"}>
                  Dasar Hukum (Mengingat)
                </Link>
              </summary>
              <ul>
                {childTokens(dasarHukum)
                  ?.flatMap((token) =>
                    token.type === "list" || token.type === "butir-list"
                      ? token.items
                      : (childTokens(token) ?? [token]),
                  )
                  ?.map((token) => (
                    <li key={token.raw}>
                      <span>{ellipsis(token.raw)}</span>
                    </li>
                  ))}
              </ul>
            </details>
          </li>
        </ul>
      </li>
      <li>
        <Link href={path + "/batang-tubuh"}>BATANG TUBUH</Link>
        <ul>
          {batangTubuh.map((token) => (
            <BatangTubuhToken
              key={token.raw}
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

function BatangTubuhToken({
  token,
  basePath,
  path,
}: {
  token: Token;
  basePath: string;
  path: string;
}) {
  const nomor =
    (token.type === "ayat" ? "ayat " : "") +
    ("nomor" in token ? token.nomor : "");
  const judul = "judul" in token ? token.judul : nomor;
  const slug = nomor
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(/[\(\)]/g, "");
  path = (token.type === "pasal" ? basePath : path) + `/${slug}`;
  const subTokens = childTokens(token)?.filter((token) =>
    ["bab", "bagian", "paragraf", "pasal", "ayat"].includes(token.type),
  );
  const preview =
    token.type === "pasal" && !subTokens?.length
      ? ellipsis(token.raw?.substring(judul.length))
      : token.type === "ayat"
        ? ellipsis(token.raw?.substring(token.nomor?.length ?? 0))
        : "";

  return (
    <li>
      {subTokens?.length ? (
        <details open={token.type === "pasal"}>
          <summary>
            <Link href={path}>{judul}</Link>
          </summary>
          <ul>
            {subTokens.map((token) => (
              <BatangTubuhToken
                key={token.raw}
                token={token}
                basePath={basePath}
                path={path}
              />
            ))}
          </ul>
        </details>
      ) : (
        <div className="flex flex-col gap-2">
          <Link className="text-nowrap" href={path}>
            {judul}
          </Link>
          {preview && (
            <Link href={path}>
              <cite>{preview}</cite>
            </Link>
          )}
        </div>
      )}
    </li>
  );
}
