import LayoutNavbar from "~/components/layout_navbar.tsx";
import LayoutFooter from "~/components/layout_footer.tsx";
import LayoutBreadcrumbs from "~/components/layout_breadcrumbs.tsx";
import LayoutPageHeading from "~/components/layout_page_heading.tsx";
import { define } from "~/utils/define.ts";

export default define.page(({ Component, url, state }) => (
  <>
    <LayoutNavbar url={url} theme={state.theme} />
    <main className="min-h-screen">
      <LayoutBreadcrumbs breadcrumbs={state.breadcrumbs} />
      <LayoutPageHeading pageHeading={state.pageHeading} />
      <Component />
    </main>
    <LayoutFooter />
  </>
));
