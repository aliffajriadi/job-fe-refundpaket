"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed w-full z-50 top-0 px-4 pt-3 pointer-events-none">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className={`max-w-3xl mx-auto pointer-events-auto transition-all duration-500 ${
          scrolled
            ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] border border-gray-200/60 dark:border-zinc-800/60"
            : "bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl shadow-[0_4px_30px_-10px_rgba(0,0,0,0.06)] border border-gray-100/50 dark:border-zinc-900/50"
        } rounded-[28px]`}
      >
        <div className="px-5 sm:px-7">
          <div className="flex justify-between h-[60px] items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-9 h-9 overflow-hidden rounded-xl shadow-sm">
                <Image
                  src="/tiktok-seeklogo.png"
                  alt="Logo"
                  fill
                  className="object-contain dark:invert"
                />
              </div>
              <span className="font-black text-lg tracking-tighter text-black dark:text-white hidden sm:flex items-center">
                PAKET<span className="text-[#FE2C55]">REFUND</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-full text-[12px] font-black text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 transition-all tracking-wide uppercase"
              >
                Beranda
              </Link>
              <Link
                href="/bantuan"
                className="px-4 py-2 rounded-full text-[12px] font-black text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 transition-all tracking-wide uppercase"
              >
                Bantuan
              </Link>
              <Link
                href="/panduan"
                className="ml-1 px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[12px] font-black tracking-wide hover:bg-[#FE2C55] dark:hover:bg-[#FE2C55] dark:hover:text-white transition-all shadow-lg shadow-black/10 hover:shadow-red-300/30 active:scale-95 uppercase"
              >
                Panduan
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="ml-2 w-10 h-10 rounded-full bg-gray-100/80 dark:bg-zinc-800/80 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-zinc-700/80 transition-colors active:scale-90"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Mobile Menu Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 rounded-2xl bg-gray-100/80 dark:bg-zinc-800/80 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-zinc-700/80 transition-colors active:scale-90"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-2xl bg-gray-100/80 dark:bg-zinc-800/80 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-zinc-700/80 transition-colors active:scale-90"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pt-1 pb-5 space-y-1.5 border-t border-gray-100/60 dark:border-zinc-800/60">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-5 py-3.5 rounded-2xl text-sm font-black text-gray-800 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-zinc-800/80 transition-colors active:scale-[0.98]"
                >
                  BERANDA
                </Link>
                <Link
                  href="/bantuan"
                  onClick={() => setIsOpen(false)}
                  className="block px-5 py-3.5 rounded-2xl text-sm font-black text-gray-800 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-zinc-800/80 transition-colors active:scale-[0.98]"
                >
                  BANTUAN
                </Link>
                <div className="pt-2 px-1">
                  <Link
                    href="/panduan"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm shadow-xl active:scale-[0.98] transition-transform"
                  >
                    PANDUAN
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
