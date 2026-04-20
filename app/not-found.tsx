import Link from "next/link";

export default function NotFound() {
  return (
    <article className="my-8 flex flex-col gap-2">
      <hgroup className="text-center">
        <h2 className="font-bold text-2xl">404</h2>
        <p className="text-lg">Laman tidak ditemukan!</p>
      </hgroup>
      <div className="md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto">
        <div className="card bg-base-200">
          <div className="card-body">
            Laman yang Anda cari tidak ada atau sudah dihapus.
          </div>
        </div>
      </div>
      <div className="w-full text-center">
        <Link href="/" className="btn btn-outline-secondary mx-auto">
          Kembali ke beranda
        </Link>
      </div>
    </article>
  );
}
