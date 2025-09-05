import Giscus from "@giscus/react";

interface Props {
  term: string;
}

export default function Comments({ term }: Props) {
  return (
    <div className="card card-border my-2 lg:my-3">
      <div className="card-body">
        <h1 className="card-title text-2xl">Komentar!</h1>
        <Giscus
          repo="mblonyox/peraturan.info"
          repoId="R_kgDOI1OCOg"
          category="Comments"
          categoryId="DIC_kwDOI1OCOs4Cu__I"
          mapping="specific"
          term={term}
          strict="1"
          reactionsEnabled="1"
          inputPosition="top"
          lang="id"
          theme="dark_dimmed"
          loading="lazy"
        />
      </div>
    </div>
  );
}
