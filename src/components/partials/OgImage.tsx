import { html } from "satori-html";

import logoBase64 from "@/assets/logo.png?inline";
import { createMarked, type PeraturanToken } from "@/lib/marked";
import { ellipsis } from "@/lib/utils/string";

interface Props {
  title: string;
  tokens: PeraturanToken[];
  url: string;
}

type VNode = ReturnType<typeof html>;

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
    vnode.props.style ??= {};
    vnode.props.style.alignItems = "center";
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
  vnode.props.style ??= {};
  vnode.props.style.display = "flex";
  vnode.props.style.flexDirection = "row";
  vnode.props.style.gap = 7;
  const children = vnode.props.children;
  if (!children || !Array.isArray(children)) return;
  const [lead, ...rest] = children;
  vnode.props.children = [
    lead,
    {
      type: "div",
      props: {
        children: rest,
        style: { width: "95%", display: "flex", flexDirection: "column" },
      },
    },
  ];
}

function normalizeMarker(vnode: VNode) {
  const marker = vnode.props["data-marker"];
  if (!marker) return;
  vnode.props.style ??= {};
  vnode.props.style.display = "flex";
  vnode.props.style.flexDirection = "row";
  vnode.props.style.gap = 7;
  const children = [vnode.props.children].flat();
  vnode.props.children = [
    marker,
    {
      type: "div",
      props: {
        children,
        style: { width: "95%", display: "flex", flexDirection: "column" },
      },
    },
  ];
  delete vnode.props["data-marker"];
}

function normalizeParagraph(vnode: VNode) {
  if (vnode.type !== "p") return vnode;
  vnode.props.style ??= {};
  vnode.props.style.marginTop = 0;
  vnode.props.style.marginBottom = 0;
}

function normalizeContainer(vnode: VNode) {
  const children = vnode.props.children;
  if (!children) return;
  vnode.props.style ??= {};

  // Use to debug
  // vnode.props.style.borderWidth = "1px";
  // vnode.props.style.borderColor = "red";

  // All texts inside peraturan is 18
  vnode.props.style.fontSize = 18;
  if (!Array.isArray(children)) return;
  vnode.props.style.display = "flex";
  vnode.props.style.flexDirection = "column";
  // vnode.props.style.alignItems = "flex-start";
  // vnode.props.style.justifyContent = "flex-start";
}

function normalizeVNode(vnode: VNode | string) {
  if (typeof vnode === "string")
    return ellipsis(vnode, 500) as unknown as VNode;

  // Normalize children
  const children = vnode.props.children;
  if (Array.isArray(children))
    vnode.props.children = children.slice(0, 5).map(normalizeVNode);
  else if (children) vnode.props.children = normalizeVNode(children);

  normalizeContainer(vnode);
  normalizeCenter(vnode);
  normalizeAyat(vnode);
  normalizeMarker(vnode);
  normalizeParagraph(vnode);
  normalizeTable(vnode);
  return vnode;
}

function TokenComponent({ tokens }: { tokens: PeraturanToken[] }) {
  const marked = createMarked();
  const vnode = html(marked.parser(tokens));
  normalizeVNode(vnode);
  vnode.props.style ??= {};
  vnode.props.style.alignItems = "center";
  return vnode as React.ReactNode;
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
