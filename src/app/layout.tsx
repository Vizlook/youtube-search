import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const seoTitle = "YouTube Search | Vizlook";
const seoDescription =
  "Search inside YouTube videos by content. Find the exact moment a concept is explained, a product is shown, or a question is answered.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    images: [
      "https://youtube-search.vizlook.com/youtube-search-screenshot.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [
      "https://youtube-search.vizlook.com/youtube-search-screenshot.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NODE_ENV === "production" && !!process.env.GOOGLE_TAG_ID && (
        <GoogleTagManager gtmId={process.env.GOOGLE_TAG_ID} />
      )}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
