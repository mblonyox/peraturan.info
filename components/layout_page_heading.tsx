import { useAppContext } from "@utils/app_context.tsx";

export default function LayoutPageHeading() {
  const { pageHeading } = useAppContext();
  if (!pageHeading) return null;
  return (
    <hgroup className="mb-3 mb-lg-5">
      <h1>{pageHeading.title}</h1>
      <p>{pageHeading.description}</p>
    </hgroup>
  );
}
