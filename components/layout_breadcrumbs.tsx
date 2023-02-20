import { useAppContext } from "@utils/app_context.tsx";

export default function LayoutBreadcrumbs() {
  const { breadcrumbs } = useAppContext();
  if (!breadcrumbs) return null;
  return (
    <nav aria-label="breadcrumb">
      <ul class="breadcrumb">
        {breadcrumbs.map(({ name, url }) => (
          <li class={"breadcrumb-item" + (url ? "" : " active")}>
            {url ? <a href={url}>{name}</a> : name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
