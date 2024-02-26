import { PageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: PageProps) {
  return (
    <article className="text-center card">
      <div className="card-body">
        <h2 className="card-title">Error 404</h2>
        <p className="card-text">
          Laman tidak ditemukan: <code>{url.toString()}</code>
        </p>
        <p className="card-text">
          Maaf, silakan cek lagi apakah tautan tersebut sudah benar.
        </p>
        <a href="/" className="btn btn-outline-secondary">
          Kembali ke beranda
        </a>
      </div>
    </article>
  );
}
