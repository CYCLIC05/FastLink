import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCategoryMenu from "@/components/StickyCategoryMenu";
import "./globals.css";
import "./print.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-inter" }); // Using font-inter to match tailwind config

export const metadata: Metadata = {
  title: "FASTLINKNEWSAFRICA",
  description: "Leading news source for Africa and the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-gray-900 bg-gray-50 flex flex-col min-h-screen">
        <StickyCategoryMenu />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
