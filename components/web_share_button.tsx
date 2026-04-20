"use client";

import { type MouseEventHandler, useCallback } from "react";

import IconShare from "@/components/icons/share";

type Props = {
  title: string;
  description: string;
  url: string;
};

export default function WebShareButton({ title, description, url }: Props) {
  const onClickShare = useCallback<MouseEventHandler>(
    (e) => {
      if ("share" in navigator) {
        e.preventDefault();
        navigator
          .share({
            title,
            text: description,
            url,
          })
          .catch(console.error);
      }
    },
    [title, description, url],
  );

  return (
    <a
      href={`https://www.addtoany.com/share#url=${encodeURI(url)}&title=${encodeURI(
        title,
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block btn-secondary text-neutral-content"
      onClick={onClickShare}
    >
      <IconShare />
      Bagikan
    </a>
  );
}
