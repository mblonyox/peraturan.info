interface Props {
  pageHeading?: {
    title: string;
    description: string;
  };
}

export default function LayoutPageHeading({ pageHeading }: Props) {
  if (!pageHeading) return null;
  return (
    <hgroup className="mb-2 mb-lg-3">
      <h1>{pageHeading.title}</h1>
      <p>{pageHeading.description}</p>
    </hgroup>
  );
}
