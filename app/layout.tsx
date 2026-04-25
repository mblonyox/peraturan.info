import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import LayoutFooter from "@/components/layout_footer";
import LayoutNavbar from "@/components/layout_navbar";
import { BASE_URL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: BASE_URL,
  title: {
    default: "Peraturan.Info",
    template: "%s | Peraturan.Info",
  },
  description:
    "Peraturan.Info adalah upaya untuk meningkatkan cara penyajian peraturan perundang-undangan di Indonesia sehingga lebih user-friendly yang terinspirasi dari legislation.gov.uk.",
  applicationName: "Peraturan.Info",
  keywords: [
    "hukum",
    "peraturan",
    "perundang-undangan",
    "Indonesia",
    "UU",
    "PERPU",
    "PP",
    "PERPRES",
  ],
  authors: [{ name: "Sukirno", url: "https://mblonyox.com" }],
  creator: "Sukirno",
  publisher: "Peraturan.Info",
  alternates: {
    types: {
      "application/atom+xml": "/atom.xml",
      "application/feed+json": "/feed.json",
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="Peraturan.Info Search"
          href="/search.xml"
        />
      </head>
      <body className="min-w-sm min-h-screen flex flex-col justify-between">
        <LayoutNavbar />
        <main className="flex-1">{children}</main>
        <LayoutFooter />
      </body>
    </html>
  );
}
