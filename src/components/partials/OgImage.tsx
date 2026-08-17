import { html } from "satori-html";

import logoBase64 from "@/assets/logo.png?inline";
import { createMarked, type PeraturanToken } from "@/lib/marked";

interface Props {
  title: string;
  tokens: PeraturanToken[];
  url: string;
}

type VNode = ReturnType<typeof html>;

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
  vnode.props.style ??= {};
  if (vnode.props.class && centerClassName.includes(vnode.props.class)) {
    vnode.props.style.alignItems = "center";
  }
}

function normalizeParagraph(vnode: VNode) {
  if (vnode.type !== "p") return vnode;
  vnode.props.style ??= {};
  vnode.props.style.marginTop = 0;
  vnode.props.style.marginBottom = 0;
}

function normalizeMarker(vnode: VNode) {
  const marker = vnode.props["data-marker"];
  if (marker) {
    vnode.props.style ??= {};
    vnode.props.style.display = "flex";
    vnode.props.style.flexDirection = "row";
    const children = vnode.props.children;
    if (!children) return;
    if (Array.isArray(children)) {
      children.unshift(marker);
    } else if (typeof children === "string") {
      vnode.props.children = [
        marker,
        normalizeVNode({ type: "p", props: { children } }),
      ];
    } else {
      vnode.props.children = [marker, children];
    }
  }
}

function normalizeVNode(vnode: VNode) {
  if (typeof vnode === "string") return vnode;
  vnode.props.style ??= {};
  vnode.props.style.fontSize = 18;
  // vnode.props.style.borderWidth = "1px";
  // vnode.props.style.borderColor = "red";
  const children = vnode.props.children;
  if (Array.isArray(children)) {
    vnode.props.children = children.slice(0, 10).map(normalizeVNode);
    vnode.props.style.display = "flex";
    vnode.props.style.flexDirection = "column";
    vnode.props.style.alignItems = "flex-start";
    vnode.props.style.justifyContent = "flex-start";
    if (vnode.type === "tr") {
      vnode.props.style.flexDirection = "row";
      vnode.props.style.justifyContent = "flex-start";
      const lastColumn = vnode.props.children.at(-1);
      if (lastColumn) {
        lastColumn.props.style ??= {};
        lastColumn.props.style.width = "85%";
      }
    }
  }
  normalizeMarker(vnode);
  normalizeParagraph(vnode);
  normalizeCenter(vnode);
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
