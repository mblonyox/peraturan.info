import { Handler, PageProps } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { marked } from "marked";
import { PartialToken, peraturan as peraturanExtension } from "@utils/md.ts";
import { getDB } from "@data/db.ts";
import { getPeraturan, Peraturan } from "@models/mod.ts";
import { readTextMd } from "@utils/fs.ts";
import PeraturanLayout from "@components/peraturan_layout.tsx";
import PeraturanMarkdown from "@components/peraturan_markdown.tsx";
import PrintButton from "@islands/print_button.tsx";

export const config: RouteConfig = {
  routeOverride: "/:jenis/:tahun/:nomor/:pasal(pasal-\\d+){/ayat-:ayat(\\d+)}?",
};

export const handler: Handler<PeraturanPartialPageProps> = async (req, ctx) => {
  const { jenis, tahun, nomor, pasal, ayat } = ctx.params;
  const db = await getDB();
  const peraturan = getPeraturan(db, jenis, tahun, nomor);
  if (!peraturan) return ctx.renderNotFound();
  const md = await readTextMd({ jenis, tahun, nomor });
  if (!md) return ctx.renderNotFound();
  marked.use(peraturanExtension);
  const tokens = marked.lexer(md);
  const getPasals = (
    tokens: marked.Tokens.Generic[],
  ): PartialToken[] =>
    tokens.map((token) =>
      token.type === "pasal"
        ? [token as PartialToken]
        : getPasals(token?.tokens ?? [])
    ).flat();
  const pasals = getPasals(tokens);
  let token: PartialToken | undefined, prev, next;
  const breadcrumbs: { name: string; url?: string }[] = [
    ...peraturan.breadcrumbs,
  ];
  token = pasals.find((token: marked.Tokens.Generic) => {
    const slug = token?.nomor?.toLowerCase()?.replace(" ", "-");
    return slug === pasal;
  });
  if (!token) return ctx.renderNotFound();
  {
    const index = pasals.indexOf(token);
    if (index > 0) {
      const prevToken = pasals[index - 1];
      prev = {
        teks: prevToken.nomor,
        url: prevToken.nomor?.toLowerCase()?.replace(" ", "-"),
      };
    }
    if (index < pasals.length - 1) {
      const nextToken = pasals[index + 1];
      next = {
        teks: nextToken.nomor,
        url: nextToken.nomor?.toLowerCase()?.replace(" ", "-"),
      };
    }
  }
  if (ayat) {
    breadcrumbs.push({
      name: token.nomor,
      url: token.nomor?.toLowerCase()?.replace(" ", "-"),
    });
    const pasal = token;
    const ayats = token.tokens;
    token = ayats?.find((token: PartialToken) => {
      const slug = token?.nomor?.toLowerCase()?.replaceAll(/[\(\)]/g, "");
      return token.type === "ayat" &&
        slug === ayat;
    });
    if (!token) return ctx.renderNotFound();
    {
      const index = ayats?.indexOf(token);
      if (!!index && index > 0) {
        const prevToken = ayats?.[index - 1];
        prev = {
          teks: `${pasal.nomor} ayat ${prevToken?.nomor}`,
          url: pasal.nomor?.toLowerCase()?.replace(" ", "-") + "/ayat-" +
            prevToken?.nomor?.toLowerCase()?.replaceAll(
              /[\(\)]/g,
              "",
            ),
        };
      }
      if (!!index && !!ayats && index < ayats?.length - 1) {
        const nextToken = ayats[index + 1];
        next = {
          teks: `${pasal.nomor} ayat ${nextToken.nomor}`,
          url: pasal.nomor?.toLowerCase()?.replace(" ", "-") + "/ayat-" +
            nextToken.nomor?.toLowerCase()?.replaceAll(
              /[\(\)]/g,
              "",
            ),
        };
      }
    }
  }
  breadcrumbs.push({
    name: (token.type === "ayat" ? `ayat ` : "") + token?.nomor,
  });
  const judulPartial = breadcrumbs.map(({ name }) => name).join(" ");
  const html = marked.parser([token as marked.Token]);
  ctx.state.seo = {
    title: `${judulPartial} | ${peraturan.rujukPanjang}`,
    description: `${token.raw}.`,
  };
  ctx.state.breadcrumbs = breadcrumbs;
  ctx.state.pageHeading = {
    title: peraturan.judul,
    description: peraturan.rujukPendek,
  };
  return ctx.render({ peraturan, prev, next, html });
};

interface PeraturanPartialPageProps {
  peraturan: Peraturan;
  prev?: { teks: string; url: string };
  next?: { teks: string; url: string };
  html: string;
}

export default function PeraturanPartialPage(
  {
    data: {
      peraturan,
      prev,
      next,
      html,
    },
  }: PageProps<
    PeraturanPartialPageProps
  >,
) {
  const {
    path,
  } = peraturan;
  return (
    <PeraturanLayout activeTab="isi">
      <div className="d-flex justify-content-between my-2">
        <a
          className={"btn btn-outline-secondary" + (!prev ? " disabled" : "")}
          href={`/${path}/${prev?.url}`}
        >
          &lt;&lt; {prev?.teks}
        </a>
        <PrintButton />
        <a
          className={"btn btn-outline-secondary" + (!next ? " disabled" : "")}
          href={`/${path}/${next?.url}`}
        >
          {next?.teks} &gt;&gt;
        </a>
      </div>
      <PeraturanMarkdown html={html} />
    </PeraturanLayout>
  );
}
