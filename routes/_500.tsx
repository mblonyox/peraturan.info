import { ErrorPageProps } from "$fresh/server.ts";

export default function Error500Page({ error, url }: ErrorPageProps) {
  return (
    <article>
      <hgroup>
        <h2>Error 500</h2>
        <p>Terjadi kesalahan : {(error as Error).message}</p>
      </hgroup>
      <a href={url.href}>
        <button className="outline">
          Muat ulang
        </button>
      </a>
    </article>
  );
}
