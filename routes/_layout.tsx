import { LayoutProps } from "$fresh/server.ts";
import LayoutNavbar from "@/components/layout_navbar.tsx";
import LayoutFooter from "@/components/layout_footer.tsx";
import LayoutBreadcrumbs from "@/components/layout_breadcrumbs.tsx";
import LayoutPageHeading from "@/components/layout_page_heading.tsx";

export default function RootLayout({ Component }: LayoutProps) {
  return (
    <>
      <LayoutNavbar />
      <main className="py-2 py-lg-3">
        <div className="container">
          <LayoutBreadcrumbs />
          <LayoutPageHeading />
          <Component></Component>
        </div>
      </main>
      <LayoutFooter />
    </>
  );
}
