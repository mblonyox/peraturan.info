interface Props {
  title: string;
  description: string;
}

export default function PageHeading({ title, description }: Props) {
  return (
    <div className="container my-5">
      <hgroup>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{title}</h1>
        <p>{description}</p>
      </hgroup>
    </div>
  );
}
