"use client";

import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  unstable_retry: () => void;
  reset: () => void;
}

export default function Error({ error, unstable_retry }: Props) {
  return (
    <article className="my-8 flex flex-col gap-2">
      <hgroup className="text-center">
        <h2 className="font-bold text-2xl">Error</h2>
        <p className="text-lg break-all">
          Terjadi kesalahan : <code>{error.message}</code>
        </p>
      </hgroup>
      <div className="md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto">
        <div className="card bg-base-200">
          <div className="card-body">
            <samp>{error.digest ?? error.message}</samp>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row gap-2 justify-center">
        <Link href="/" className="btn btn-outline-secondary">
          Kembali ke beranda
        </Link>
        <button
          type="button"
          onClick={unstable_retry}
          className="btn btn-outline-secondary"
        >
          Coba lagi
        </button>
      </div>
    </article>
  );
}
