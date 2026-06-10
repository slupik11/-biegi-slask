import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Biegi Śląsk — Kalendarz Biegów",
  description: "Automatyczny kalendarz biegów z województwa śląskiego i okolic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-orange-600 hover:text-orange-700">
              🏃 Biegi Śląsk
            </Link>
            <nav className="flex gap-3 text-sm font-medium items-center">
              <Link href="/jak-to-dziala" className="text-gray-500 hover:text-gray-900 hidden sm:inline">
                Jak to działa?
              </Link>
              <Link
                href="/zglos-bieg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                + Zgłoś bieg
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-8 py-6 text-center text-sm text-gray-400">
          Biegi Śląsk © {new Date().getFullYear()} · Dane zbierane automatycznie z publicznych źródeł
        </footer>
      </body>
    </html>
  );
}
