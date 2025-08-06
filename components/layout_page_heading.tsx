import { useAppContext } from "~/utils/app_context.ts";

export default function LayoutPageHeading() {
  const { pageHeading } = useAppContext();
  if (!pageHeading) return null;
  return (
    <hgroup className="mb-2 mb-lg-3">
      <h1>{pageHeading.title}</h1>
      <p>{pageHeading.description}</p>
    </hgroup>
  );
}
