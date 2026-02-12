import type { Metadata } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Linear Control Theory",
    template: "%s | Linear Control Theory",
  },
  description: "Course notes and walkthroughs for linear control theory.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <body>
        <Layout
          editLink={null}
          feedback={{
            content: null,
          }}
          footer={
            <Footer>
              Linear Control Theory Notes for students.
            </Footer>
          }
          navbar={<Navbar logo={<strong>Linear Control Theory</strong>} />}
          pageMap={await getPageMap()}
          sidebar={{
            defaultMenuCollapseLevel: 1,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
