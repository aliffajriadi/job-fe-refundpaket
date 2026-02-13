import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import Snowfall from "@/components/Snowfall";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaketRefund - Form Pengajuan Refund",
  description:
    "Halaman form untuk mengajukan pengembalian dana paket Anda secara mudah dan cepat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-950 text-black dark:text-white min-h-screen flex flex-col`}
      >
        <NextTopLoader color="#FE2C55" showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MaintenanceGuard>
            <Snowfall />
            <Navbar />
            <main className="grow pt-20">{children}</main>
            <Footer />
          </MaintenanceGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
