import { ellipsis } from "~/utils/string.ts";
import WebShareButton from "~/islands/web_share_button.tsx";

interface Props {
  url: URL;
  seo?: { title: string; description: string; image?: string };
}

export default function SocialShareButtons({ url, seo }: Props) {
  const urlString = url.toString();
  const title = seo?.title ?? "";
  const description = seo?.description ?? "";

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
        <WebShareButton
          {...{ url: urlString, title, description }}
        />
      </div>
    </div>
  );
}

function TwitterShareButton(
  { url, title, description }: {
    url: string;
    title: string;
    description: string;
  },
) {
  return (
    <a
      href={`https://twitter.com/intent/tweet?text=${
        encodeURI(ellipsis(`${title}: ${description}`, 240))
      }&url=${encodeURI(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block bg-[#15202b] text-neutral-content"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-twitter-x"
        viewBox="0 0 16 16"
      >
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
      </svg>
      Tweet
    </a>
  );
}

function WhatsAppShareButton({ url, title, description }: {
  url: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={`https://wa.me/?text=${
        encodeURI(ellipsis(`${title}: ${description}`, 240))
      }%20${encodeURI(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block bg-[#25D366] text-neutral-content"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        className="bi bi-whatsapp mx-2"
        viewBox="0 0 16 16"
      >
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
      </svg>
      WhatsApp
    </a>
  );
}

function LinkedInShareButton({ url }: {
  url: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={`https://www.linkedin.com/sharing/share-offsite/?url=${
        encodeURI(url)
      }`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-block bg-[#0e76a8] text-neutral-content"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-linkedin mx-2"
        viewBox="0 0 16 16"
      >
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
      </svg>LinkedIn
    </a>
  );
}
