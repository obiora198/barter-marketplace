import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "../app/components/SessionWrapper";
import Navigation from "./components/Navigation";
import Footer from "../app/components/Footer";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barter Marketplace",
  description: "Trade goods without money",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Barter Marketplace</title>
        <meta name="description" content="Trade goods without money" />
        {/* Favicon Links */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Web Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        {/* Theme Colors */}
        <meta name="theme-color" content="#4F46E5" /> {/* Indigo-600 */}
        <meta name="msapplication-TileColor" content="#4F46E5" />
        {/* PWA Settings */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <Navigation />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
