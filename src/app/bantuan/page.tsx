"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  HelpCircle,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

export default function BantuanPage() {
  const faqs = [
    {
      q: "Berapa lama proses refund paket?",
      a: "Proses verifikasi manual biasanya memakan waktu 3-5 hari kerja setelah data dikirimkan melalui form.",
    },
    {
      q: "Kenapa refund saya ditolak?",
      a: "Biasanya karena foto resi tidak jelas, nomor rekening salah, atau alamat tidak sesuai dengan data pengiriman asli.",
    },
    {
      q: "Bisakah ganti rekening setelah dikirim?",
      a: "Mohon maaf, data yang sudah masuk tidak bisa diubah. Pastikan data benar saat pengisian form.",
    },
    {
      q: "Syarat minimal nominal refund?",
      a: "Tidak ada minimal nominal, selama paket Anda memenuhi kriteria pengembalian kami.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-black pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
              PUSAT <span className="text-[#FE2C55]">BANTUAN</span>
            </h1>
            <p className="text-gray-400 font-bold max-w-md mx-auto">
              Ada masalah dengan proses refund paket anda? Kami siap membantu
              24/7.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border-2 border-gray-100 rounded-[32px] p-8 shadow-2xl shadow-gray-100 flex items-center gap-6"
          >
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-black leading-none mb-2">
                WhatsApp
              </h3>
              <p className="text-[#FE2C55] font-black text-sm tracking-tight cursor-pointer hover:underline">
                0812-3456-7890
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border-2 border-gray-100 rounded-[32px] p-8 shadow-2xl shadow-gray-100 flex items-center gap-6"
          >
            <div className="w-16 h-16 bg-[#FE2C55] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-100">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-black leading-none mb-2">
                Email Support
              </h3>
              <p className="text-black font-black text-sm tracking-tight cursor-pointer hover:underline">
                help@refundpaket.id
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="bg-black p-2 rounded-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-black tracking-tight uppercase">
              Pertanyaan Populer
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-gray-50 rounded-[24px] open:bg-white open:border-2 open:border-[#FE2C55]/10 p-6 transition-all duration-300"
              >
                <summary className="flex justify-between items-center font-black text-lg text-black cursor-pointer list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 pt-4 border-t border-gray-100 text-gray-500 font-bold leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-20 p-10 bg-gray-50 rounded-[40px] text-center border-2 border-dashed border-gray-200">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-black mb-2">
            Masih punya pertanyaan lain?
          </h3>
          <p className="text-gray-400 font-bold mb-8">
            Pesan anda akan dibalas dalam waktu kurang dari 24 jam.
          </p>
          <button className="flex items-center gap-2 mx-auto px-8 py-4 bg-black text-white font-black rounded-full hover:scale-105 transition-transform shadow-xl">
            <MessageSquare className="w-5 h-5" />
            KIRIM PESAN
          </button>
        </div>
      </div>
    </div>
  );
}
