import { PageProps } from "$fresh/server.ts";
import { JENIS_PERATURAN, SEO_DESCRIPTION, SEO_TITLE } from "@utils/const.ts";
import SeoTags from "../components/seo_tags.tsx";

export default function Home({ url }: PageProps) {
  return (
    <div>
      <SeoTags
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        url={url.toString()}
      />
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
  );
}
