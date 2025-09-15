import { define } from "~/utils/define.ts";
import { HttpError } from "fresh";

export default define.page(({ error, url }) => {
  const status = error instanceof HttpError ? error.status : 500;
  const message = (error as Error).message ?? "Unknow error";
  return (
    <article className="my-8 flex flex-col gap-2">
      <hgroup className="text-center">
        <h2 className="font-bold text-2xl">Error {status}</h2>

        {status === 404
          ? (
            <p className="text-lg">
              Laman tidak ditemukan!
            </p>
          )
          : (
            <p className="text-lg">
              Terjadi kesalahan : <code>{message}</code>
            </p>
          )}
      </hgroup>
      <div className="md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto">
        <div className="card bg-base-200">
          <div className="card-body">
            <samp>
              URL&nbsp;&nbsp;:&nbsp;{url.toString()}
              <br />
              Time&nbsp;:&nbsp;{new Date().toISOString()}
            </samp>
          </div>
        </div>
      </div>
      <div className="w-full text-center">
        <a href="/" className="btn btn-outline-secondary mx-auto">
          Kembali ke beranda
        </a>
      </div>
    </article>
  );
});
