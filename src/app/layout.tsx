import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { buildPageMetadata } from "@/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildPageMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "light" }}
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-[#f4f4f5] antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f4f5] text-zinc-900">
        {children}
      </body>
    </html>
  );
}
