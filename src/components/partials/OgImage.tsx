import sanitize from "sanitize-html";
import { html } from "satori-html";

import logoBase64 from "@/assets/logo.png?inline";
import {
  createMarked,
  type PeraturanToken,
  sanitizeOptions,
} from "@/lib/marked";
import { ellipsis } from "@/lib/utils/string";

interface Props {
  title: string;
  tokens: PeraturanToken[];
  url: string;
}

type VNode = ReturnType<typeof html>;

const MAX_CHARACTERS = 240;
const MAX_SUBITEMS = 10;

function queryByTypes(vnode: VNode, types: string[]): VNode[] {
  if (types.includes(vnode.type)) return [vnode];
  return [vnode.props.children]
    .flat()
    .filter((v): v is VNode => typeof v === "object")
    .flatMap((child) => queryByTypes(child, types));
}

const centerClassName = [
  "judul",
  "frasa-drtyme",
  "jabatan-pembentuk",
  "persetujuan",
  "kata-memutuskan",
  "buku",
  "bab",
  "bagian",
  "paragraf",
  "pasal",
];

function normalizeCenter(vnode: VNode) {
  if (centerClassName.includes(vnode.props.class)) {
    const children = { ...vnode };
    vnode.type = "div";
    vnode.props = {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      children,
    };
  }
}

function normalizeTable(vnode: VNode) {
  if (vnode.type !== "table") return;
  const trs = queryByTypes(vnode, ["tr"]);
  trs.forEach((tr) => {
    tr.props.style ??= {};
    tr.props.style.borderWidth = "1px";
    tr.props.style.display = "flex";
    tr.props.style.flexDirection = "row";
    tr.props.style.justifyContent = "space-between";
    const columns = queryByTypes(tr, ["td", "th"]);
    const lastColumn = columns.at(-1);
    if (lastColumn) {
      lastColumn.props.style ??= {};
      lastColumn.props.style.width = "85%";
    }
  });
}

function normalizeAyat(vnode: VNode) {
  if (vnode.props.class !== "ayat") return;
  const children = vnode.props.children;
  if (!children || !Array.isArray(children)) return;
  const [lead, ...subChildren] = children;
  const content = {
    type: "div",
    props: {
      children: subChildren,
      style: {
        width: "97%",
        display: "flex",
        flexDirection: "column",
      },
    },
  };
  vnode.type = "div";
  vnode.props = {};
  vnode.props.children = [lead, content];
  vnode.props.style ??= {};
  vnode.props.style.fontSize = 18;
  vnode.props.style.lineHeight = 1.25;
  vnode.props.style.display = "flex";
  vnode.props.style.flexDirection = "row";
  vnode.props.style.gap = 7;
}

function normalizeMarker(vnode: VNode) {
  const marker = vnode.props["data-marker"];
  if (!marker) return;
  delete vnode.props["data-marker"];
  const subchildren = [{ ...vnode }];
  const content = {
    type: "div",
    props: {
      children: subchildren,
      style: {
        width: "97%",
        display: "flex",
        flexDirection: "column",
      },
    },
  };
  vnode.type = "div";
  vnode.props = {};
  vnode.props.children = [marker, content];
  vnode.props.style ??= {};
  vnode.props.style.fontSize = 18;
  vnode.props.style.lineHeight = 1.25;
  vnode.props.style.display = "flex";
  vnode.props.style.flexDirection = "row";
  vnode.props.style.gap = 7;
}

function normalizeContainer(vnode: VNode) {
  const children = vnode.props.children;
  if (!children) return;

  vnode.props.style ??= {};

  // Use to debug
  // vnode.props.style.borderWidth = "1px";
  // vnode.props.style.borderColor = "red";

  if ([children].flat().some((v) => typeof v === "string")) {
    vnode.props.style.fontSize = 18;
    vnode.props.style.lineHeight = 1.25;
    vnode.props.style.display = "contents";
  } else {
    vnode.props.style.display = "flex";
    vnode.props.style.flexDirection = "column";
  }
}

function normalizeBr(vnode: VNode) {
  if (vnode.type !== "br") return;
  vnode.props.style ??= {};
  vnode.props.style.display = "block";
  vnode.props.style.height = 12;
}

function normalizeVNode(vnode: VNode | string) {
  if (typeof vnode === "string")
    return ellipsis(vnode, MAX_CHARACTERS) as unknown as VNode;

  // Normalize children
  const children = vnode.props.children;
  if (Array.isArray(children))
    vnode.props.children = children.slice(0, MAX_SUBITEMS).map(normalizeVNode);
  else if (children) vnode.props.children = normalizeVNode(children);

  normalizeContainer(vnode);
  normalizeCenter(vnode);
  normalizeAyat(vnode);
  normalizeMarker(vnode);
  normalizeTable(vnode);
  normalizeBr(vnode);

  return vnode;
}

function reduceSubTokens(tokens: PeraturanToken[]) {
  return tokens.slice(0, MAX_SUBITEMS).map((t) => {
    if (t.tokens) t.tokens = reduceSubTokens(t.tokens);
    return t;
  });
}

function TokenComponent({ tokens }: { tokens: PeraturanToken[] }) {
  const reducedTokens = reduceSubTokens(tokens);
  const marked = createMarked();
  const parsed = marked.parser(reducedTokens);
  const sanitized = sanitize(parsed, sanitizeOptions);
  const vnode = html(sanitized);
  return normalizeVNode(vnode) as React.ReactNode;
}

export default function PartialsOgImage({ title, tokens, url }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        background: "linear-gradient(to left, #212529, #343a40, #2b3035)",
      }}
    >
      <div
        style={{
          width: "90%",
          fontSize: 32,
          fontWeight: "bold",
          color: "#ffffff",
          textOverflow: "ellipsis",
          lineClamp: 2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          height: "60%",
          backgroundColor: "#ffffff",
          color: "#000000",
          overflow: "hidden",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <TokenComponent tokens={tokens} />
      </div>
      <img
        src={logoBase64}
        alt=""
        style={{
          width: 256,
          height: 256,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
      <div
        style={{
          fontSize: 16,
          color: "#ffffff",
        }}
      >
        {url}
      </div>
    </div>
  );
}
