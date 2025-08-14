interface Props {
  pageHeading?: {
    title: string;
    description: string;
  };
}

export default function LayoutPageHeading({ pageHeading }: Props) {
  if (!pageHeading) return null;
  return (
    <div className="container my-5">
      <hgroup>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          {pageHeading.title}
        </h1>
        <p>{pageHeading.description}</p>
      </hgroup>
    </div>
  );
}
