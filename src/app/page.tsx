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
  Banknote,
  ClipboardCheck,
  Sparkles,
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
  { id: 5, title: "Konfirmasi", icon: ClipboardCheck },
];

const BANKS = [
  "BCA",
  "BNI",
  "BRI",
  "Mandiri",
  "BSI",
  "CIMB Niaga",
  "Danamon",
  "Permata",
  "BTPN",
  "DANA",
  "OVO",
  "GoPay",
  "ShopeePay",
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
    bankName: "",
    bankAccountNumber: "",
    bankAccountHolder: "",
    agreed: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
    if (!formData.agreed) return;
    setIsSubmitting(true);

    const pesan = `
*PENGAJUAN REFUND BARU* 📦
👤 *Biodata:*
- Nama: ${formData.fullName}
- WA: ${formData.phoneNumber}
📦 *Pesanan:*
- Resi: ${formData.receiptNumber}
- Alamat: ${formData.address}
💳 *Rekening:*
- Bank: ${formData.bankName}
- No. Rek: ${formData.bankAccountNumber}
- Atas Nama: ${formData.bankAccountHolder}
✅ *Status Konfirmasi:* Telah Disetujui`.trim();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("pesan", pesan);
      if (file) formDataToSend.append("file", file);

      const res = await fetch("/api/notify", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) setIsSuccess(true);
      else alert("Gagal mengirim pengajuan.");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.fullName || !formData.phoneNumber;
    if (currentStep === 2) return !formData.receiptNumber || !formData.address;
    if (currentStep === 3)
      return (
        !formData.bankName ||
        !formData.bankAccountNumber ||
        !formData.bankAccountHolder
      );
    if (currentStep === 4) return !file;
    if (currentStep === 5) return !formData.agreed;
    return false;
  };

  /* ============= SUCCESS STATE ============= */
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-white via-red-50/30 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 relative overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-60 h-60 bg-[#FE2C55]/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-black/5 dark:bg-white/5 rounded-full blur-[100px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="max-w-md w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[44px] p-12 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.12)] border border-white/60 dark:border-zinc-800/60 text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 relative"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute inset-0 bg-green-200 dark:bg-green-500/20 rounded-[32px]"
            />
            <Check
              className="w-12 h-12 text-green-500 relative z-10"
              strokeWidth={3}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-4xl font-black text-black dark:text-white mb-3 tracking-tighter">
              BERHASIL!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-10 leading-relaxed text-[15px]">
              Pengajuan refund Anda telah dikirim ke tim kami.
              <br />
              Cek WhatsApp Anda untuk update selanjutnya.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.reload()}
            className="w-full py-5 px-8 bg-linear-to-r from-[#FE2C55] to-[#ff4d6d] text-white font-black rounded-[24px] shadow-2xl shadow-red-200/50 flex items-center justify-center gap-2 group"
          >
            KEMBALI KE BERANDA
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ============= MAIN FORM ============= */
  return (
    <div className="relative min-h-screen bg-linear-to-b from-gray-50/50 via-white to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background hero image */}
      <div className="absolute top-0 left-0 w-full h-[520px] overflow-hidden pointer-events-none">
        <Image
          src="/bg.jpeg"
          alt="Background"
          fill
          priority
          className="object-cover opacity-[0.15] dark:opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/60 to-white dark:via-zinc-950/60 dark:to-zinc-950" />
      </div>

      {/* Subtle animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 -left-20 w-[400px] h-[400px] bg-[#FE2C55]/[0.04] dark:bg-[#FE2C55]/[0.08] rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-96 -right-20 w-[500px] h-[500px] bg-gray-200/30 dark:bg-zinc-800/20 rounded-full blur-[90px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* ─── HEADER ─── */}
          <header className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-xl shadow-black/10"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FE2C55]" />
              SECURE REFUND
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[clamp(2.5rem,8vw,3.75rem)] font-black text-black dark:text-white mb-5 tracking-tighter leading-[0.95]"
            >
              PAKET<span className="text-[#FE2C55]">REFUND</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-gray-400 dark:text-gray-500 font-bold text-sm max-w-[300px] mx-auto leading-snug"
            >
              Proses pengembalian dana mudah dan cepat dalam beberapa langkah
              sederhana.
            </motion.p>
          </header>

          {/* ─── STEPPER PROGRESS ─── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mb-14 px-2"
          >
            {/* Track */}
            <div className="absolute top-1/2 left-4 right-4 h-[5px] bg-gray-100 dark:bg-zinc-800 -translate-y-1/2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#FE2C55] to-[#ff6b81] rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.6, ease: "circOut" }}
              />
            </div>
            <div className="relative flex justify-between items-center">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.id;
                const isCurrent = currentStep === step.id;
                const isDone = isActive && step.id < currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <motion.div
                      animate={{ scale: isCurrent ? 1.15 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 22,
                      }}
                      className={cn(
                        "w-[50px] h-[50px] rounded-[18px] flex items-center justify-center relative z-10 border-[3px] border-white dark:border-zinc-900 transition-all duration-300",
                        isDone
                          ? "bg-black dark:bg-zinc-800 text-white shadow-lg shadow-black/15"
                          : isActive
                            ? "bg-linear-to-br from-[#FE2C55] to-[#ff4d6d] text-white shadow-lg shadow-red-200/50"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 shadow-sm",
                      )}
                    >
                      {isDone ? (
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </motion.div>

                    {/* Step label on mobile (only current) */}
                    <AnimatePresence>
                      {isCurrent && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute -bottom-7 text-[9px] font-black text-gray-500 tracking-[0.15em] uppercase whitespace-nowrap"
                        >
                          {step.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ─── FORM CARD ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[44px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100/80 dark:border-zinc-800/80 overflow-hidden mb-12"
          >
            <div className="p-8 sm:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25, ease: "circOut" }}
                >
                  {/* STEP 1: BIODATA */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <StepHeader title="INFORMASI PRIBADI" step={1} />
                      <div className="space-y-5">
                        <InputField
                          label="Nama Lengkap"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama sesuai KTP"
                        />
                        <InputField
                          label="Nomor WhatsApp"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Contoh: 081234567890"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PESANAN */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <StepHeader title="DETAIL PENGIRIMAN" step={2} />
                      <div className="space-y-5">
                        <InputField
                          label="Nomor Resi"
                          name="receiptNumber"
                          value={formData.receiptNumber}
                          onChange={handleInputChange}
                          placeholder="Contoh: TikTok-12345678"
                        />
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">
                            Alamat Lengkap
                          </label>
                          <textarea
                            name="address"
                            rows={4}
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50/80 dark:bg-zinc-800/50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white dark:focus:bg-zinc-800 rounded-[20px] px-6 py-4 font-bold text-black dark:text-white transition-all outline-none placeholder-gray-300 dark:placeholder-zinc-600 shadow-sm resize-none"
                            placeholder="Tuliskan alamat lengkap pengiriman"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: REKENING */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <StepHeader title="REKENING REFUND" step={3} />
                      <div className="space-y-5">
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 bg-linear-to-r from-red-50/80 to-red-50/40 dark:from-red-900/10 dark:to-red-800/10 border border-red-100/60 dark:border-red-900/20 rounded-[24px] flex gap-4 items-center"
                        >
                          <div className="w-10 h-10 bg-[#FE2C55] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200/50">
                            <AlertCircle className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-[11px] font-bold text-gray-700 leading-tight">
                            Pastikan nomor rekening benar untuk keperluan
                            transfer balik dana Anda.
                          </p>
                        </motion.div>

                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">
                            Pilih Bank / E-Wallet
                          </label>
                          <select
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50/80 dark:bg-zinc-800/50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white dark:focus:bg-zinc-800 rounded-[20px] px-6 py-4 font-bold text-black dark:text-white transition-all outline-none shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="">-- Pilih Bank --</option>
                            {BANKS.map((bank) => (
                              <option key={bank} value={bank}>
                                {bank}
                              </option>
                            ))}
                          </select>
                        </div>

                        <InputField
                          label="Nomor Rekening"
                          name="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={handleInputChange}
                          placeholder="Contoh: 0021345678"
                        />
                        <InputField
                          label="Atas Nama Rekening"
                          name="bankAccountHolder"
                          value={formData.bankAccountHolder}
                          onChange={handleInputChange}
                          placeholder="Nama pemilik rekening"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: UPLOAD */}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <StepHeader title="UNGGAH FOTO RESI" step={4} />
                      <motion.div
                        layout
                        className={cn(
                          "relative border-[3px] border-dashed rounded-[36px] transition-all duration-300 flex flex-col items-center justify-center p-10 min-h-[300px]",
                          dragActive
                            ? "border-[#FE2C55] bg-red-50/50 dark:bg-red-900/10 scale-[0.99]"
                            : "border-gray-200/80 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-800/20 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 hover:border-gray-300/60 dark:hover:border-zinc-700",
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {preview ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full text-center"
                          >
                            <div className="relative group inline-block">
                              <div className="rounded-[28px] overflow-hidden shadow-2xl border-4 border-white">
                                <Image
                                  src={preview}
                                  alt="Preview"
                                  width={320}
                                  height={256}
                                  className="max-w-xs h-auto max-h-64 object-contain"
                                />
                              </div>
                              <button
                                onClick={() => handleFileChange(null)}
                                className="absolute -top-3 -right-3 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-xl hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all hover:rotate-90"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-2.5 text-black font-black uppercase tracking-[0.2em] text-[11px]">
                              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                              File terpilih
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="w-20 h-20 bg-black dark:bg-zinc-800 rounded-[24px] flex items-center justify-center mb-7 shadow-2xl shadow-black/20"
                            >
                              <Upload className="w-10 h-10 text-white" />
                            </motion.div>
                            <h3 className="text-black dark:text-white font-black text-lg mb-1.5 tracking-tight">
                              UPLOAD FOTO RESI
                            </h3>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                              PNG atau JPG (Maks 5MB)
                            </p>
                            <label className="px-10 py-4 bg-linear-to-r from-[#FE2C55] to-[#ff4d6d] text-white text-sm font-black rounded-[20px] cursor-pointer transition-all shadow-xl shadow-red-200/40 active:scale-95 hover:shadow-red-200/60">
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
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* STEP 5: KONFIRMASI */}
                  {currentStep === 5 && (
                    <div className="space-y-8">
                      <StepHeader title="KONFIRMASI DATA" step={5} isLast />
                      <div className="bg-gray-50/60 dark:bg-zinc-800/30 rounded-[32px] p-7 space-y-0 border border-gray-100/80 dark:border-zinc-800 divide-y divide-gray-100/80 dark:divide-zinc-800">
                        <SummaryRow
                          icon={User}
                          label="Penerima"
                          value={formData.fullName}
                          sub={formData.phoneNumber}
                        />
                        <SummaryRow
                          icon={FileText}
                          label="No. Resi & Alamat"
                          value={formData.receiptNumber}
                          sub={formData.address}
                        />
                        <SummaryRow
                          icon={Banknote}
                          label="Tujuan Refund"
                          value={`${formData.bankName} - ${formData.bankAccountNumber}`}
                          sub={`A/N ${formData.bankAccountHolder}`}
                          isLast
                        />
                      </div>

                      <label className="flex items-start gap-4 p-6 bg-linear-to-r from-red-50/60 to-red-50/30 dark:from-red-900/10 dark:to-red-800/10 rounded-[28px] border border-red-100/60 dark:border-red-900/20 cursor-pointer hover:from-red-50 hover:to-red-50/60 transition-all group">
                        <input
                          type="checkbox"
                          name="agreed"
                          checked={formData.agreed}
                          onChange={handleInputChange}
                          className="w-6 h-6 mt-0.5 rounded-lg border-2 border-red-200 text-[#FE2C55] focus:ring-[#FE2C55] cursor-pointer accent-[#FE2C55]"
                        />
                        <p className="text-[12px] font-bold text-gray-700 leading-relaxed">
                          Saya menyatakan bahwa data di atas adalah benar dan
                          dapat dipertanggungjawabkan untuk proses refund.
                        </p>
                      </label>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ─── NAVIGATION BUTTONS ─── */}
              <div className="mt-12 flex flex-col sm:flex-row gap-3.5">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={prevStep}
                    className="flex-1 py-[18px] px-8 bg-gray-50/80 dark:bg-zinc-800/80 text-black dark:text-white font-black rounded-[22px] flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-[13px] tracking-wide order-2 sm:order-1 border border-gray-100/80 dark:border-zinc-800/80"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    KEMBALI
                  </motion.button>
                )}
                {currentStep < STEPS.length ? (
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={nextStep}
                    disabled={isNextDisabled()}
                    className="flex-[2] py-[18px] px-8 bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100 disabled:bg-gray-100 dark:disabled:bg-zinc-800 disabled:text-gray-300 dark:disabled:text-gray-600 text-white dark:text-black font-black rounded-[22px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-black/10 order-1 sm:order-2 text-[13px] tracking-wide group"
                  >
                    SELANJUTNYA
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting || isNextDisabled()}
                    className="flex-[2] py-[18px] px-8 bg-linear-to-r from-[#FE2C55] to-[#ff4d6d] hover:opacity-95 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300 text-white font-black rounded-[22px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-200/40 order-1 sm:order-2 text-[13px] tracking-wide group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        MENGIRIM...
                      </>
                    ) : (
                      <>
                        KIRIM SEKARANG
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em] leading-loose">
              Proses verifikasi dilakukan secara manual
              <br />
              oleh tim refund kami supaya aman.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ============= SUB-COMPONENTS ============= */

function StepHeader({
  title,
  step,
  isLast,
}: {
  title: string;
  step: number;
  isLast?: boolean;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
        {title}
      </h2>
      <div className="flex items-center gap-3">
        <div className="h-1 w-8 bg-linear-to-r from-[#FE2C55] to-[#ff6b81] rounded-full" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
          {isLast ? "Langkah Terakhir" : `Langkah ${step} dari 5`}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50/80 dark:bg-zinc-800/50 border-2 border-transparent focus:border-[#FE2C55] focus:bg-white dark:focus:bg-zinc-800 rounded-[20px] px-6 py-4 font-bold text-black dark:text-white transition-all outline-none placeholder-gray-300 dark:placeholder-zinc-600 shadow-sm"
        placeholder={placeholder}
      />
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  sub,
  isLast,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  isLast?: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-4 py-5", isLast ? "" : "")}>
      <div className="w-9 h-9 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-md shrink-0 border border-gray-100/80 dark:border-zinc-700/50">
        <Icon className="w-4 h-4 text-[#FE2C55]" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <p className="text-[15px] font-black text-black dark:text-white leading-snug truncate">
          {value}
        </p>
        <p className="text-[12px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5 truncate">
          {sub}
        </p>
      </div>
    </div>
  );
}
