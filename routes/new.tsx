import { PageProps } from "$fresh/server.ts";
import { SEO_DESCRIPTION, SEO_TITLE } from "@utils/const.ts";
import SeoTags from "@components/seo_tags.tsx";

export default function Terbaru({ url }: PageProps) {
  return (
    <div>
      <SeoTags
        title={`Terbaru | ${SEO_TITLE}`}
        description={SEO_DESCRIPTION}
        url={url.toString()}
      />
      <h1>Peraturan Terbaru</h1>
      <p>
        Selalu <i>up-to-date</i>{" "}
        dengan Peraturan Perundang-undangan terbaru yang ditetapkan pada situs
        ini dengan layanan berlangganan gratis menggunakan <i>RSS Feed.</i>
      </p>
    </div>
  );
}
