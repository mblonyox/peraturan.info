import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import LayoutNavbar from "@/components/layout_navbar";
import LayoutFooter from "@/components/layout_footer";
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
  title: {
    default: "Peraturan.Info",
    template: "%s | Peraturan.Info",
  },
  description: "",
  metadataBase: BASE_URL,
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
      <body className="min-w-sm min-h-screen flex flex-col justify-between">
        <LayoutNavbar />
        <main className="flex-1">{children}</main>
        <LayoutFooter />
      </body>
    </html>
  );
}
