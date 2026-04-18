import { notFound } from "next/navigation";
import { cache } from "react";

import { createMarked, type PeraturanToken } from "@/lib/marked";
import { ellipsis } from "@/utils/string";
import { SetNav } from "./nav";
import { getPeraturanData } from "../data";

interface Data {
  html: string;
  prev: { name: string; url: string } | null;
  next: { name: string; url: string } | null;
  title?: string;
  description?: string;
}

type Props = PageProps<"/[jenis]/[tahun]/[nomor]/[...partials]">;

function handleIsi(md: string, partials: string[]): Data | null {
  if (partials.length !== 1 || partials.at(0) !== "isi") return null;
  const marked = createMarked();
  const tokens = marked.lexer(md) as PeraturanToken[];
  const html = marked.parser(tokens);

  return {
    html,
    prev: null,
    next: null,
    title: "Isi Peraturan",
  };
}

function handleRootPartial(md: string, partials: string[]): Data | null {
  const partial = partials.at(0);
  if (
    !partial ||
    ![
      "judul",
      "pembukaan",
      "konsideran",
      "dasar-hukum",
      "batang-tubuh",
    ].includes(partial)
  )
    return null;
  const marked = createMarked();
  let tokens = marked.lexer(md) as PeraturanToken[];
  if (partial === "pembukaan") {
    tokens = tokens.filter((token) =>
      ["frasa-jabatan", "konsideran", "dasar-hukum", "diktum"].includes(
        token.type,
      ),
    );
  } else if (partial === "batang-tubuh") {
    tokens = tokens.filter((token) =>
      ["buku", "bab", "pasal"].includes(token.type),
    );
  } else {
    tokens = tokens.filter((token) => token.type === partial);
  }
  if (!tokens || !tokens.length) notFound();
  const title = partial
    .split("-")
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ");
  const description = ellipsis(
    tokens.map((token) => token.raw).join("\n"),
    155,
  );
  const html = marked.parser(tokens);
  return { html, prev: null, next: null, title, description };
}

function getPasalTokens(tokens: PeraturanToken[]): PeraturanToken[] {
  return tokens.flatMap((token) =>
    token.type === "pasal" ? [token] : getPasalTokens(token?.tokens ?? []),
  );
}

function handlePasalPartial(md: string, partials: string[]): Data | null {
  const path = partials.join("/");
  const re = /^(pasal-\d+)(?:\/ayat-(\d+))?$/;
  const match = re.exec(path);
  if (!match) return null;
  const [, pasal, ayat] = match;
  const marked = createMarked();
  const tokens = marked.lexer(md);
  const pasalTokens = getPasalTokens(tokens);
  let token: PeraturanToken | undefined,
    title: string | undefined,
    prev: { name: string; url: string } | null = null,
    next: { name: string; url: string } | null = null;
  token = pasalTokens.find((token: PeraturanToken) => {
    const slug = token.nomor?.toLowerCase().replace(" ", "-");
    return slug === pasal;
  });
  if (!token?.nomor) notFound();
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
    if (!token) notFound();
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
  const html = marked.parser([token]);
  const description = ellipsis(token.raw, 155);
  return { html, prev, next, title, description };
}

function handleBukuPartial(md: string, partials: string[]) {
  const re =
    /^(?:(buku-\w+)\/?)?(?:(bab-[mdclxvi]+)(?:\/(bagian-\w+)(?:\/(paragraf-\d+))?)?)?$/;
  const match = re.exec(partials.join("/"));
  if (!match) return null;
  const [, buku, bab, bagian, paragraf] = match;
  const marked = createMarked();
  const rootTokens = marked.lexer(md) as PeraturanToken[];
  let tokens = [...rootTokens] as PeraturanToken[];
  let token: PeraturanToken | undefined,
    title: string | undefined,
    prev: { name: string; url: string } | null = null,
    next: { name: string; url: string } | null = null;
  for (const [k, v] of Object.entries({ buku, bab, bagian, paragraf })) {
    if (!v) continue;
    tokens = tokens.filter((token) => token.type === k);
    token = tokens.find(
      (token) => token.nomor?.toLowerCase().replace(" ", "-") === v,
    );
    if (!token?.nomor) notFound();
    title = title ? `${title}, ${token.nomor}` : token.nomor;
    const index = tokens.indexOf(token);
    if (index > 0) {
      const prevToken = tokens[index - 1];
      if (prevToken.nomor) {
        prev = {
          name: prevToken.nomor,
          url: prevToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
    }
    if (index < tokens.length - 1) {
      const nextToken = tokens[index + 1];
      if (nextToken.nomor) {
        next = {
          name: nextToken.nomor,
          url: nextToken.nomor.toLowerCase().replace(" ", "-"),
        };
      }
    }
    tokens = token.tokens!;
  }
  if (!token?.nomor) notFound();
  const html = marked.parser([token as PeraturanToken]);
  const description = ellipsis(token.raw, 155);
  return { html, prev, next, title, description };
}

const generateData = cache(async (props: Props): Promise<Data> => {
  const params = await props.params;
  const { md } = await getPeraturanData(params);
  if (!md) notFound();
  const partials = params.partials;
  return (
    handleIsi(md, partials) ??
    handleRootPartial(md, partials) ??
    handlePasalPartial(md, partials) ??
    handleBukuPartial(md, partials) ??
    notFound()
  );
});

export async function generateMetadata(props: Props) {
  const { title, description } = await generateData(props);
  return { title, description };
}

export default async function Page(props: Props) {
  const { html, prev, next } = await generateData(props);
  return (
    <>
      <SetNav prev={prev} next={next} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
