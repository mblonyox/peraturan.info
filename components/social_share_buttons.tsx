"use client";

import { useSyncExternalStore } from "react";

import WebShareButton from "@/components/islands/web_share_button";
import IconLinkedIn from "@/components/icons/linked-in";
import IconTwitterX from "@/components/icons/twitter-x";
import IconWhatsApp from "@/components/icons/whatsapp";
import { ellipsis } from "@/utils/string";

const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
  };
};

const getSnapshotUrl = () => document.location.href;

const getSnapshotTitle = () => document.title;

const getSnapshotDescription = () =>
  document.querySelector("meta[name=description]")?.getAttribute("content") ??
  "";

const getServerSnapshot = () => "";

const useUrl = () =>
  useSyncExternalStore(subscribe, getSnapshotUrl, getServerSnapshot);

const useTitle = () =>
  useSyncExternalStore(subscribe, getSnapshotTitle, getServerSnapshot);

const useDescription = () =>
  useSyncExternalStore(subscribe, getSnapshotDescription, getServerSnapshot);

export default function SocialShareButtons() {
  const urlString = useUrl();
  const title = useTitle();
  const description = useDescription();

  return (
    <div className="flex flex-col md:flex-row gap-1 my-2 lg:my-3">
      <div className="flex-1">
        <TwitterShareButton {...{ url: urlString, title, description }} />
      </div>
      <div className="flex-1">
        <WhatsAppShareButton {...{ url: urlString, title, description }} />
      </div>
      <div className="flex-1">
        <LinkedInShareButton {...{ url: urlString, title, description }} />
      </div>
      <div className="flex-1">
        <WebShareButton {...{ url: urlString, title, description }} />
      </div>
    </div>
  );
}

function TwitterShareButton({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={`https://twitter.com/intent/tweet?text=${encodeURI(
        ellipsis(`${title}: ${description}`, 240),
      )}&url=${encodeURI(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block bg-[#15202b] text-neutral-content"
    >
      <IconTwitterX />
      Tweet
    </a>
  );
}

function WhatsAppShareButton({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={`https://wa.me/?text=${encodeURI(
        ellipsis(`${title}: ${description}`, 240),
      )}%20${encodeURI(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block bg-[#25D366] text-neutral-content"
    >
      <IconWhatsApp />
      WhatsApp
    </a>
  );
}

function LinkedInShareButton({
  url,
}: {
  url: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI(
        url,
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block bg-[#0e76a8] text-neutral-content"
    >
      <IconLinkedIn />
      LinkedIn
    </a>
  );
}
