import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <article>
      <hgroup>
        <h2>Error 404</h2>
        <p>Laman tidak ditemukan: {url.pathname}</p>
      </hgroup>
      <a href="/">
        <button className="outline">
          Kembali ke beranda
        </button>
      </a>
    </article>
  );
}
