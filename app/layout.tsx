import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from './components/Footer'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FootStats",
  description: "all your football needs in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-black min-h-screen flex flex-col`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
