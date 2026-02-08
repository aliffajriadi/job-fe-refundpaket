"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  Play,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function PanduanPage() {
  const categories = [
    {
      title: "Mulai Refund",
      icon: Play,
      desc: "Langkah awal mengajukan pengembalian dana",
    },
    {
      title: "Syarat & Ketentuan",
      icon: BookOpen,
      desc: "Kriteria paket yang bisa di-refund",
    },
    {
      title: "Kebijakan Privasi",
      icon: ShieldCheck,
      desc: "Bagaimana kami menjaga data Anda",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Siapkan Data Diri",
      desc: "Siapkan nomor handphone aktif dan data diri sesuai KTP untuk keperluan verifikasi.",
    },
    {
      num: "02",
      title: "Foto Bukti Resi",
      desc: "Pastikan foto resi pengiriman paket terlihat jelas, tidak blur, dan terbaca nomornya.",
    },
    {
      num: "03",
      title: "Isi Form Refund Paket",
      desc: "Lengkapi formulir di halaman utama. Pastikan nomor rekening tujuan sudah benar.",
    },
    {
      num: "04",
      title: "Tunggu Verifikasi",
      desc: "Tim kami akan memproses pengajuan Anda dalam 3-5 hari kerja.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Panduan */}
      <div className="bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-black text-black tracking-tighter mb-6"
          >
            PANDUAN <span className="text-[#FE2C55]">REFUND</span>
          </motion.h1>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Cari tutorial atau bantuan..."
              className="w-full bg-white border-none rounded-full py-5 px-8 pr-16 shadow-2xl shadow-gray-200 font-bold text-black outline-none placeholder-gray-400"
            />
            <div className="absolute right-3 top-2.5 bg-[#FE2C55] p-3 rounded-full text-white">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-16">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white border-2 border-gray-50 rounded-[32px] p-8 shadow-sm hover:border-[#FE2C55]/20 group cursor-pointer transition-all"
            >
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FE2C55] transition-colors">
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">
                {cat.title}
              </h3>
              <p className="text-gray-400 text-sm font-bold leading-snug">
                {cat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Steps Section */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-black tracking-tighter">
              ALUR PENGAJUAN
            </h2>
            <div className="w-20 h-2 bg-[#FE2C55] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="text-6xl font-black text-gray-100 select-none">
                  {step.num}
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-black tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-gray-500 font-bold leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-10 bg-black rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-black tracking-tight">
              Sudah Paham Caranya?
            </h3>
            <p className="text-gray-400 font-bold">
              Mulai ajukan pengembalian paket anda sekarang juga.
            </p>
          </div>
          <Link
            href="/"
            className="px-10 py-5 bg-[#FE2C55] text-white font-black rounded-full flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-red-900/20"
          >
            ISI FORM SEKARANG
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
