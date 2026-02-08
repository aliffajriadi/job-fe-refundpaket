"use client";

import React, { useState, useCallback } from "react";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  FileText,
  CreditCard,
  User,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = [
  { id: 1, title: "Biodata", icon: User },
  { id: 2, title: "Pesanan", icon: FileText },
  { id: 3, title: "Rekening", icon: CreditCard },
  { id: 4, title: "Bukti", icon: Upload },
];

export default function RefundPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    receiptNumber: "",
    address: "",
    bankAccountNumber: "",
    bankAccountHolder: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.fullName || !formData.phoneNumber;
    if (currentStep === 2) return !formData.receiptNumber || !formData.address;
    if (currentStep === 3)
      return !formData.bankAccountNumber || !formData.bankAccountHolder;
    if (currentStep === 4) return !file;
    return false;
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-black mb-2 tracking-tighter">
            SUKSES!
          </h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Pengajuan refund Anda telah diterima dan akan segera kami
            verifikasi.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 px-6 bg-[#FE2C55] text-white font-black rounded-full transition-all shadow-lg shadow-red-200 active:scale-95"
          >
            KEMBALI KE BERANDA
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FE2C55]" />
            SECURE REFUND
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black text-black mb-4 tracking-tighter leading-none">
            REFUND<span className="text-[#FE2C55]">PAKET</span>
          </h1>
          <p className="text-gray-500 font-semibold text-sm max-w-xs mx-auto leading-tight">
            Proses pengembalian dana mudah dan cepat dalam beberapa langkah.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="relative mb-14 px-4">
          <div className="absolute top-1/2 left-0 w-full h-[6px] bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#FE2C55]"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="relative flex justify-between items-center">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center relative z-10 border-4 border-white transition-all duration-300 shadow-sm",
                      isActive
                        ? "bg-[#FE2C55] text-white"
                        : "bg-gray-100 text-gray-400",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && step.id < currentStep && (
                      <div className="absolute inset-0 bg-black rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-50 overflow-hidden mb-10">
          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* STEP 1: BIODATA */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-black tracking-tight">
                        INFORMASI PRIBADI
                      </h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Langkah 1 dari 4
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-black uppercase tracking-widest ml-1">
                          Nama Lengkap
                        </label>
                        <input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white rounded-2xl px-5 py-4 font-bold text-black transition-all outline-none placeholder-gray-300 shadow-sm"
                          placeholder="Masukkan nama sesuai KTP"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-black uppercase tracking-widest ml-1">
                          Nomor WhatsApp
                        </label>
                        <input
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white rounded-2xl px-5 py-4 font-bold text-black transition-all outline-none placeholder-gray-300 shadow-sm"
                          placeholder="Contoh: 081234567890"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PESANAN */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-black tracking-tight">
                        DETAIL PENGIRIMAN
                      </h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Langkah 2 dari 4
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-black uppercase tracking-widest ml-1">
                          Nomor Resi
                        </label>
                        <input
                          name="receiptNumber"
                          value={formData.receiptNumber}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white rounded-2xl px-5 py-4 font-bold text-black transition-all outline-none placeholder-gray-300 shadow-sm"
                          placeholder="Contoh: TikTok-12345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-black uppercase tracking-widest ml-1">
                          Alamat Lengkap
                        </label>
                        <textarea
                          name="address"
                          rows={4}
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white rounded-2xl px-5 py-4 font-bold text-black transition-all outline-none placeholder-gray-300 shadow-sm resize-none"
                          placeholder="Tuliskan alamat lengkap pengiriman"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: REKENING */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-black tracking-tight">
                        REKENING REFUND
                      </h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Langkah 3 dari 4
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="p-5 bg-red-50 border border-red-100 rounded-3xl flex gap-4">
                        <AlertCircle className="w-6 h-6 text-[#FE2C55] shrink-0" />
                        <p className="text-[11px] font-bold text-black leading-tight uppercase tracking-tight">
                          PASTIKAN NOMOR REKENING BENAR UNTUK KEPERLUAN TRANSFER
                          BALIK DANA ANDA.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-black uppercase tracking-widest ml-1">
                          Nomor Rekening
                        </label>
                        <input
                          name="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white rounded-2xl px-5 py-4 font-bold text-black transition-all outline-none placeholder-gray-300 shadow-sm"
                          placeholder="Contoh: 0021345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-black uppercase tracking-widest ml-1">
                          Atas Nama Rekening
                        </label>
                        <input
                          name="bankAccountHolder"
                          value={formData.bankAccountHolder}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white rounded-2xl px-5 py-4 font-bold text-black transition-all outline-none placeholder-gray-300 shadow-sm"
                          placeholder="Nama pemilik rekening"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: UPLOAD */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-black tracking-tight">
                        UNGGAH BUKTI
                      </h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Langkah 4 dari 4
                      </p>
                    </div>
                    <div
                      className={cn(
                        "relative border-[3px] border-dashed rounded-[32px] transition-all duration-300 flex flex-col items-center justify-center p-10 min-h-[300px]",
                        dragActive
                          ? "border-[#FE2C55] bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100/50",
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {preview ? (
                        <div className="w-full text-center">
                          <div className="relative group inline-block">
                            <Image
                              src={preview}
                              alt="Preview"
                              width={320}
                              height={256}
                              className="max-w-xs h-auto max-h-64 object-contain rounded-3xl shadow-2xl border-4 border-white"
                            />
                            <button
                              onClick={() => handleFileChange(null)}
                              className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="mt-6 flex items-center justify-center gap-2 text-black font-black uppercase tracking-widest text-xs">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            FILE TERPILIH
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-black rounded-[24px] flex items-center justify-center mb-6 shadow-xl">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-black font-black text-lg mb-2 tracking-tight">
                            TARUH FOTO RESI
                          </p>
                          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            PNG ATAU JPG (MAKS 5MB)
                          </p>
                          <label className="px-10 py-4 bg-[#FE2C55] hover:opacity-90 text-white text-sm font-black rounded-full cursor-pointer transition-all shadow-lg shadow-red-200 active:scale-95">
                            PILIH FILE
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) =>
                                e.target.files &&
                                handleFileChange(e.target.files[0])
                              }
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex-1 py-5 px-8 bg-gray-100 text-black font-black rounded-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-sm tracking-tight order-2 sm:order-1"
                >
                  <ChevronLeft className="w-5 h-5" />
                  KEMBALI
                </button>
              )}

              {currentStep < STEPS.length ? (
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className="flex-2 py-5 px-8 bg-black hover:opacity-90 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black rounded-full flex items-center justify-center gap-2 transition-all shadow-xl order-1 sm:order-2 text-sm tracking-tight"
                >
                  SELANJUTNYA
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isNextDisabled()}
                  className="flex-2 py-5 px-8 bg-[#FE2C55] hover:opacity-95 disabled:bg-gray-100 disabled:text-gray-300 text-white font-black rounded-full flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-200 order-1 sm:order-2 text-sm tracking-tight"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      MEMPROSES...
                    </>
                  ) : (
                    <>
                      KIRIM SEKARANG
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
            PROSES VERIFIKASI DILAKUKAN SECARA MANUAL <br />
            OLEH TIM REFUND KAMI SUPAYA AMAN.
          </p>
        </div>
      </div>
    </div>
  );
}
