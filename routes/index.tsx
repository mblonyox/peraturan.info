import { Head } from "$fresh/runtime.ts";
import { JENIS_PERATURAN } from "../utils/const.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Peraturan.deno.dev</title>
        <meta
          name="description"
          content=" Peraturan.deno.dev adalah upaya untuk meningkatkan cara penyajian peraturan perundang-undangan di Indonesia sehingga lebih user-friendly yang terinspirasi dari legislation.gov.uk."
        />
      </Head>
      <div>
        <h1>
          Peraturan<span style={{ color: "var(--muted-color)" }}>
            .deno.dev
          </span>
        </h1>
        <p>
          Peraturan.deno.dev adalah upaya untuk meningkatkan cara penyajian
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
        <p>
          Mulai cari peraturan dari bentuk-bentuk berikut:
        </p>
        <ul>
          {JENIS_PERATURAN.map((x) => (
            <li>
              <a href={`/${x.kode}`}>{x.nama}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
