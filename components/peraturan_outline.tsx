import { createMarked, type PeraturanToken } from "~/utils/md.ts";
import { ellipsis } from "~/utils/string.ts";

interface PeraturanOutlineProps {
  md: string;
  path: string;
}

export default function PeraturanOutline(
  { md, path }: PeraturanOutlineProps,
) {
  const marked = createMarked();
  const tokens = marked.lexer(md) as PeraturanToken[];
  const judul = tokens.find((token) => token.type === "judul");
  const konsideran = tokens.find((token) => token.type === "konsideran");
  const dasarHukum = tokens.find((token) => token.type === "dasar-hukum");
  const batangTubuh = tokens.filter((token) =>
    token.type === "buku" || token.type === "bab" || token.type === "pasal"
  );

  return (
    <ul className="menu w-full bg-base-200 border border-base-300 rounded-box">
      <li>
        <div className="flex flex-col gap-2">
          <a href={path + "/judul"}>JUDUL</a>
          <cite>{judul?.raw}</cite>
        </div>
      </li>
      <li>
        <a href={path + "/pembukaan"}>PEMBUKAAN</a>
        <ul>
          <li>
            <details>
              <summary>
                <a href={path + "/konsideran"}>Konsideran (Menimbang)</a>
              </summary>
              <ul>
                {konsideran?.tokens?.map((token: PeraturanToken) =>
                  (token.type === "list" || token.type === "butir-list")
                    ? token.items
                    : (token.tokens ?? [token])
                ).flat().map(
                  (token) => (
                    <li key={token}>
                      <span>{ellipsis(token.raw)}</span>
                    </li>
                  ),
                )}
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>
                <a href={path + "/dasar-hukum"}>Dasar Hukum (Mengingat)</a>
              </summary>
              <ul>
                {dasarHukum?.tokens?.map((token: PeraturanToken) =>
                  (token.type === "list" || token.type === "butir-list")
                    ? token.items
                    : (token.tokens ?? [token])
                ).flat().map(
                  (token) => (
                    <li key={token}>
                      <span>{ellipsis(token.raw)}</span>
                    </li>
                  ),
                )}
              </ul>
            </details>
          </li>
        </ul>
      </li>
      <li>
        <a href={path + "/batang-tubuh"}>BATANG TUBUH</a>
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
    token: PeraturanToken;
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
    ? ellipsis(token.raw?.substring(token.nomor?.length ?? 0))
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
          <div className="flex flex-col gap-2">
            <a className="text-nowrap" href={path}>{judul}</a>
            {preview && (
              <a href={path}>
                <cite>{preview}</cite>
              </a>
            )}
          </div>
        )}
    </li>
  );
}
