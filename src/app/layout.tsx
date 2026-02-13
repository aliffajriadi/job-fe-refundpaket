import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import MaintenanceGuard from "@/components/MaintenanceGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Refund Paket - Form Pengajuan Refund",
  description: "Halaman form untuk mengajukan pengembalian dana paket Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen flex flex-col`}
      >
        <NextTopLoader color="#FE2C55" showSpinner={false} />
        <MaintenanceGuard>
          <Navbar />
          <main className="grow pt-16">{children}</main>
          <Footer />
        </MaintenanceGuard>
      </body>
    </html>
  );
}
