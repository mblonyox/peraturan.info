import { asset } from "$fresh/runtime.ts";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useAppContext } from "@/utils/app_context.ts";
import { ellipsis } from "@/utils/string.ts";

declare global {
  // deno-lint-ignore no-explicit-any
  const bootstrap: any;
}

type WMCounter = {
  count: number;
  type: {
    bookmark?: number;
    like?: number;
    mention?: number;
    reply?: number;
    "rsvp-yes"?: number;
    "rsvp-no"?: number;
    "rsvp-maybe"?: number;
    "rsvp-interested"?: number;
  };
};

type WMEntry = {
  type: "entry";
  author: WMCard;
  url: string;
  published: string | null;
  "wm-id": number;
  "wm-private": boolean;
  "wm-property": WMProperty;
  "wm-received": string;
  "wm-source": string;
  "wm-target": string;
  photo?: string;
  video?: string;
  audio?: string;
  content?: WMContent;
  rels?: {
    canonical: string;
  };
};
type WMCard = {
  type: "card";
  name: string;
  photo: string;
  url: string;
};

type WMProperty =
  | "in-reply-to"
  | "like-of"
  | "repost-of"
  | "bookmark-of"
  | "follow-of"
  | "mention-of"
  | "rsvp";

type WMContent = {
  html?: string;
  text: string;
};

const reactionEmoji: Record<string, string> = {
  bookmark: "⭐️",
  like: "❤️",
  mention: "@",
  reply: "↩️",
  "rsvp-yes": "✅",
  "rsvp-no": "❌",
  "rsvp-maybe": "💭",
  "rsvp-interested": "💡",
};

function ReactionCounter({ counter }: { counter: WMCounter }) {
  const elRef = useSignal<HTMLDivElement | null>(null);
  useSignalEffect(() => {
    if (typeof document === "undefined" || typeof bootstrap === "undefined") {
      return;
    }
    const containerEl = elRef.value;
    if (!containerEl) return;
    const tooltipTriggerList = containerEl.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    const tooltipList = Array.from(tooltipTriggerList).map((
      tooltipTriggerEl,
    ) => new bootstrap.Tooltip(tooltipTriggerEl));
    return () => tooltipList.forEach((tooltip) => tooltip.dispose());
  });

  return (
    <div
      className="d-flex align-items-center gap-1 my-1"
      ref={(el) => elRef.value = el}
    >
      <h3>Tanggapan ({counter.count}):</h3>
      {Object.entries(counter.type).map(([type, count]) => (
        <div
          className="p-2 rounded border"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title={type}
        >
          {reactionEmoji[type]} {count}
        </div>
      ))}
    </div>
  );
}

function CommentCard({ entry }: { entry: WMEntry }) {
  const url = new URL(entry.url);
  const who = entry.author.name || url.hostname;
  return (
    <div className="card p-3 my-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <a
          href={entry.author.url || url.origin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={entry.author.photo || asset("/logo.webp")}
            className="rounded-circle me-2"
            loading="lazy"
            decoding="async"
            alt={who}
            width={32}
            height={32}
            onError={(e) => {
              e.currentTarget.src = asset("/logo.webp");
            }}
          />
          <span className="fw-bold">{who}</span>
        </a>
        <small>{entry["wm-received"]}</small>
      </div>
      <p>{ellipsis(entry.content?.text ?? "", 280)}</p>
    </div>
  );
}

async function getComments(target: string): Promise<WMEntry[]> {
  const url = new URL("/api/mentions.jf2", "https://webmention.io");
  url.searchParams.set("per-page", "30");
  url.searchParams.set("sort-by", "published");
  url.searchParams.set("sort-dir", "down");
  url.searchParams.set("target", target);
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const data = await response.json();
  return data.children;
}

async function getCounter(target: string): Promise<WMCounter> {
  const url = new URL("/api/count", "https://webmention.io");
  url.searchParams.set("target", target);
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
}

export default function Webmentions() {
  const comments = useSignal<WMEntry[]>([]);
  const counter = useSignal<WMCounter>({ count: 0, type: {} });
  const { url } = useAppContext();
  const target = typeof document === "undefined"
    ? (url?.toString() ?? "")
    : document.URL;
  useSignalEffect(() => {
    getComments(target).then((value) => comments.value = value);
    getCounter(target).then((value) => counter.value = value);
  });
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-tittle">Webmentions</h2>
        <p className="card-text">
          Anda dapat memberikan tanggapan atas peraturan ini dengan <i>like</i>,
          {" "}
          <i>retweet/repost</i> pada <i>tweet</i>{" "}
          yang mencantumkan tautan pada laman ini.
        </p>
        <ReactionCounter counter={counter.value} />
        <div className="d-grid">
          <a
            href={`https://quill.p3k.io/?dontask=1&me=https://commentpara.de/&reply=${target}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Tulis tanggapan.
          </a>
        </div>
        {comments.value.map((comment) => <CommentCard entry={comment} />)}
      </div>
    </div>
  );
}
