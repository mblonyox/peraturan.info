import type { PageProps } from "fresh";

export default function Error500Page({ error, url }: PageProps) {
  const message = (error as Error).message ?? "Unknow error";
  return (
    <article className="text-center card">
      <div className="card-body">
        <h2 className="card-title">Error 500</h2>
        <p className="card-text">
          Terjadi kesalahan : <code>{message}</code>
        </p>
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="card bg-body-secondary text-start">
              <div className="card-body">
                <samp>
                  URL : {url.toString()} <br />
                  Time : {new Date().toISOString()}
                </samp>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
