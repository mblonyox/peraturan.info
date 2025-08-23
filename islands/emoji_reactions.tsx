import { SlackSelector } from "@charkour/react-reactions";
import { useSignal } from "@preact/signals";
import { useCallback, useRef } from "preact/hooks";

interface Props {
  counters: [string, number][];
  path: string;
}

export default function EmojiReactions(
  { counters: initCounters, path }: Props,
) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const counters = useSignal(initCounters);
  const getEmojis = useCallback(async () => {
    const resp = await fetch("/api/reactions?path=" + encodeURIComponent(path));
    if (!resp.ok) return;
    const result = await resp.json();
    counters.value = result;
  }, [path]);
  const postEmoji = useCallback(async (emoji: string) => {
    const resp = await fetch("/api/reactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ path, emoji }),
    });
    if (!resp.ok) return;
    await getEmojis();
  }, [path]);

  return (
    <div className="card card-border my-2 lg:my-3">
      <div className="card-body">
        <h1 className="card-title text-2xl">Reaksi!</h1>
        <div className="flex gap-1">
          {counters.value.map(([t, n]) => (
            <div key={t} className="p-2 rounded-box bg-base-300 text-2xl">
              {t}
              <span className="ms-2">{n}</span>
            </div>
          ))}
          {!counters.value.length && <span>Belum ada reaksi.</span>}
        </div>
        <div className="card-actions justify-end">
          <button
            type="button"
            className="btn btn-outline"
            style="anchor-name:--reactions"
            popovertarget="reactions"
          >
            Berikan Reaksi
          </button>
          <div
            ref={dropdownRef}
            id="reactions"
            className="dropdown dropdown-end dropdown-top"
            style="position-anchor:--reactions"
            popover
          >
            <SlackSelector
              onSelect={(emoji) => {
                postEmoji(emoji);
                dropdownRef.current?.togglePopover();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
