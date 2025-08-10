import { useCallback } from "preact/hooks";

type Props = {
  title: string;
  description: string;
  url: string;
};

export default function WebShareButton({ title, description, url }: Props) {
  const onClickShare = useCallback((e: Event) => {
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
  }, [title, description, url]);

  return (
    <a
      href={`https://www.addtoany.com/share#url=${encodeURI(url)}&title=${
        encodeURI(title)
      }`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block btn-secondary text-neutral-content"
      onClick={onClickShare}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-share mx-2"
        viewBox="0 0 16 16"
      >
        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
      </svg>Bagikan
    </a>
  );
}
