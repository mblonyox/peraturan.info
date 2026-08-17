import type { Tokens } from "marked";

import { type PeraturanToken } from "../marked";
import { ellipsis } from "./string";

function getPasalTokens(tokens: PeraturanToken[]): PeraturanToken[] {
  return tokens.flatMap((token) =>
    token.type === "pasal" ? [token] : getPasalTokens(token?.tokens ?? []),
  );
}

interface Data {
  tokens: PeraturanToken[];
  prev?: { name: string; url: string };
  next?: { name: string; url: string };
  title?: string;
  description?: string;
}

export function handlerPartials(
  partials: string,
  rootTokens: PeraturanToken[],
): Data | null {
  function handleIsi(): Data | null {
    if (partials !== "isi") return null;

    return {
      tokens: rootTokens,
      title: "Isi Peraturan",
    };
  }

  function handleRootPartial(): Data | null {
    if (
      !partials ||
      ![
        "judul",
        "pembukaan",
        "konsideran",
        "dasar-hukum",
        "batang-tubuh",
      ].includes(partials)
    )
      return null;
    let tokens = [...rootTokens];
    if (partials === "pembukaan") {
      tokens = tokens.filter((token) =>
        ["frasa-jabatan", "konsideran", "dasar-hukum", "diktum"].includes(
          token.type,
        ),
      );
    } else if (partials === "batang-tubuh") {
      tokens = tokens.filter((token) =>
        ["buku", "bab", "pasal"].includes(token.type),
      );
    } else {
      tokens = tokens.filter((token) => token.type === partials);
    }
    if (!tokens || !tokens.length) return null;
    const title = partials
      .split("-")
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(" ");
    const description = ellipsis(
      tokens.map((token) => token.raw).join("\n"),
      155,
    );
    return { tokens, title, description };
  }

  function handlePasalPartial(): Data | null {
    const re = /^(pasal-\d+)(?:\/ayat-(\d+))?$/;
    const match = re.exec(partials);
    if (!match) return null;
    const [, pasal, ayat] = match;
    const pasalTokens = getPasalTokens(rootTokens);
    let token: PeraturanToken | undefined,
      title: string | undefined,
      prev: { name: string; url: string } | undefined,
      next: { name: string; url: string } | undefined;
    token = pasalTokens.find((token: PeraturanToken) => {
      const slug = token.nomor?.toLowerCase().replace(" ", "-");
      return slug === pasal;
    });
    if (!token?.nomor) return null;
    title = token.nomor;
    {
      const index = pasalTokens.indexOf(token);
      if (index > 0) {
        const prevToken = pasalTokens[index - 1];
        if (prevToken.nomor) {
          prev = {
            name: prevToken.nomor,
            url: prevToken.nomor.toLowerCase().replace(" ", "-"),
          };
        }
      }
      if (index < pasalTokens.length - 1) {
        const nextToken = pasalTokens[index + 1];
        if (nextToken.nomor) {
          next = {
            name: nextToken.nomor,
            url: nextToken.nomor.toLowerCase().replace(" ", "-"),
          };
        }
      }
    }
    if (ayat) {
      const pasal = token;
      const ayats = token.tokens as PeraturanToken[];
      token = ayats.find((token) => {
        const slug = token?.nomor?.toLowerCase()?.replaceAll(/[\(\)]/g, "");
        return token.type === "ayat" && slug === ayat;
      });
      if (!token) return null;
      title = `${pasal.nomor} ayat ${token.nomor}`;
      const index = ayats.indexOf(token);
      if (index > 0) {
        const prevToken = ayats[index - 1];
        if (prevToken.nomor) {
          prev = {
            name: `${pasal.nomor} ayat ${prevToken?.nomor}`,
            url: `${pasal.nomor?.toLowerCase()?.replace(" ", "-")}/ayat-${prevToken?.nomor?.toLowerCase()?.replaceAll(/[\(\)]/g, "")}`,
          };
        }
      }
      if (index < ayats.length - 1) {
        const nextToken = ayats[index + 1];
        if (nextToken.nomor) {
          next = {
            name: `${pasal.nomor} ayat ${nextToken.nomor}`,
            url: `${pasal.nomor?.toLowerCase().replace(" ", "-")}/ayat-${nextToken.nomor?.toLowerCase().replaceAll(/[\(\)]/g, "")}`,
          };
        }
      }
    }
    const description = ellipsis(token.raw, 155);
    return { tokens: [token], prev, next, title, description };
  }

  function handlePasalRomawiPartial(): Data | null {
    const re = /^(pasal-[mdclxvi]+)(?:\/angka-(\d+))?$/;
    const match = re.exec(partials);
    if (!match) return null;
    const [, pasal, angka] = match;
    const pasalTokens = getPasalTokens(rootTokens);
    let token: Tokens.Generic | undefined,
      title: string | undefined,
      prev: { name: string; url: string } | undefined,
      next: { name: string; url: string } | undefined;
    token = pasalTokens.find((token: PeraturanToken) => {
      const slug = token.nomor?.toLowerCase().replace(" ", "-");
      return slug === pasal;
    });
    if (!token?.nomor) return null;
    title = token.nomor;
    {
      const index = pasalTokens.indexOf(token);
      if (index > 0) {
        const prevToken = pasalTokens[index - 1];
        if (prevToken.nomor) {
          prev = {
            name: prevToken.nomor,
            url: prevToken.nomor.toLowerCase().replace(" ", "-"),
          };
        }
      }
      if (index < pasalTokens.length - 1) {
        const nextToken = pasalTokens[index + 1];
        if (nextToken.nomor) {
          next = {
            name: nextToken.nomor,
            url: nextToken.nomor.toLowerCase().replace(" ", "-"),
          };
        }
      }
    }
    if (angka) {
      const pasal = token;
      const butirs = (token.tokens ?? [])
        .flatMap((token) =>
          token.type === "butir-list" ? (token.items as Tokens.Generic[]) : [],
        )
        .filter(
          (token) =>
            token.type === "butir-item" && /^\d+\.$/.test(token.marker),
        );
      token = butirs.find((token) => {
        if (!("marker" in token)) return;
        const nomor = token.marker.replace(".", "");
        return nomor === angka;
      });
      if (!token) return null;
      const nomor = (token.marker as string).replace(".", "");
      title = `${pasal.nomor} angka ${nomor}`;
      const index = butirs.indexOf(token);
      if (index > 0) {
        const prevToken = butirs[index - 1];
        if (prevToken.marker) {
          const nomor = prevToken.marker.replace(".", "");
          prev = {
            name: `${pasal.nomor} angka ${nomor}`,
            url: `${pasal.nomor?.toLowerCase()?.replace(" ", "-")}/angka-${nomor}`,
          };
        }
      }
      if (index < butirs.length - 1) {
        const nextToken = butirs[index + 1];
        if (nextToken.marker) {
          const nomor = nextToken.marker.replace(".", "");
          next = {
            name: `${pasal.nomor} angka ${nomor}`,
            url: `${pasal.nomor?.toLowerCase().replace(" ", "-")}/angka-${nomor}`,
          };
        }
      }
      token = {
        type: "butir-list",
        raw: token.raw,
        items: [token],
      };
    }
    const description = ellipsis(token.raw, 155);
    return { tokens: [token], prev, next, title, description };
  }

  function handleBukuPartial() {
    const re =
      /^(?:(buku-\w+)\/?)?(?:(bab-[mdclxvi]+)(?:\/(bagian-\w+)(?:\/(paragraf-\d+))?)?)?$/;
    const match = re.exec(partials);
    if (!match) return null;
    const [, buku, bab, bagian, paragraf] = match;
    let tokens = [...rootTokens];
    let token: PeraturanToken | undefined,
      title: string | undefined,
      prev: { name: string; url: string } | undefined,
      next: { name: string; url: string } | undefined,
      path: string | undefined;
    for (const [k, v] of Object.entries({ buku, bab, bagian, paragraf })) {
      if (!v) {
        if (k === "buku") continue;
        else break;
      }
      tokens = tokens.filter((t) => t.type === k);
      token = tokens.find(
        (t) => t.nomor?.toLowerCase().replace(" ", "-") === v,
      );
      if (!token?.nomor) return null;
      title = title ? `${title}, ${token.nomor}` : token.nomor;
      const index = tokens.indexOf(token);
      if (index > 0) {
        const prevToken = tokens[index - 1];
        if (prevToken.nomor) {
          const subPath = prevToken.nomor.toLowerCase().replace(" ", "-");
          prev = {
            name: prevToken.nomor,
            url: path ? `${path}/${subPath}` : subPath,
          };
        }
      }
      if (index < tokens.length - 1) {
        const nextToken = tokens[index + 1];
        if (nextToken.nomor) {
          const subPath = nextToken.nomor.toLowerCase().replace(" ", "-");
          next = {
            name: nextToken.nomor,
            url: path ? `${path}/${subPath}` : subPath,
          };
        }
      }
      const subPath = token.nomor.toLowerCase().replace(" ", "-");
      path = path ? `${path}/${subPath}` : subPath;
      tokens = token.tokens ?? [];
    }
    if (!token?.nomor) return null;
    const description = ellipsis(token.raw, 155);
    return { tokens: [token], prev, next, title, description };
  }

  return (
    handleIsi() ??
    handleRootPartial() ??
    handlePasalPartial() ??
    handlePasalRomawiPartial() ??
    handleBukuPartial()
  );
}
