import { define } from "~/utils/define.ts";
import { asset } from "fresh/runtime";

export default define.page(() => (
  <div className="hero min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <img
          src={asset("/logo.webp")}
          alt="Logo Peraturan.Info"
          className="mx-auto mb-5"
          width={256}
          height={256}
        />
        <h1 className="text-5xl font-bold mb-2">
          Peraturan<span className="text-neutral-500">.Info</span>
        </h1>
        <p className="mb-5">
          Peraturan.Info adalah upaya untuk meningkatkan cara penyajian
          peraturan perundang-undangan di Indonesia sehingga lebih user-friendly
          yang terinspirasi dari layanan{" "}
          <a
            href="https://legislation.gov.uk"
            target="_blank"
            rel="noreferrer noopener"
          >
            legislation.gov.uk
          </a>.
        </p>
        <a href="/all" className="btn btn-primary">Lihat Semua Peraturan.</a>
      </div>
    </div>
  </div>
));
