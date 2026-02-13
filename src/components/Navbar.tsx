"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/tiktok-seeklogo.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="font-black text-xl md:text-2xl tracking-tighter text-black flex items-center">
                REFUND<span className="text-[#FE2C55]">PAKET</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-900 hover:text-[#FE2C55] font-bold text-sm tracking-tight transition-colors"
            >
              BERANDA
            </Link>
            <Link
              href="/bantuan"
              className="text-gray-900 hover:text-[#FE2C55] font-bold text-sm tracking-tight transition-colors"
            >
              BANTUAN
            </Link>

            {/* CTA Button */}
            <Link
              href="/panduan"
              className="px-6 py-2 rounded-full bg-black text-white font-black text-sm hover:bg-[#FE2C55] transition-all shadow-md shadow-gray-200"
            >
              PANDUAN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-3">
            <Link
              href="/"
              className="block px-3 py-3 rounded-xl text-base font-black text-gray-900 hover:bg-gray-50 transition-colors"
            >
              BERANDA
            </Link>
            <Link
              href="/bantuan"
              className="block px-3 py-3 rounded-xl text-base font-black text-gray-900 hover:bg-gray-50 transition-colors"
            >
              BANTUAN
            </Link>
            <div className="pt-4 px-3">
              <Link
                href="/panduan"
                className="block w-full text-center py-4 rounded-full bg-black text-white font-black shadow-lg"
              >
                PANDUAN
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
