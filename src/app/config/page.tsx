"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Settings,
  BellOff,
  Globe,
  Save,
  Loader2,
  ArrowLeft,
  Lock,
  Key,
} from "lucide-react";
import Link from "next/link";

export default function HiddenSettingsPage() {
  const [config, setConfig] = useState({
    telegramDisabled: false,
    webDisabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Password protection state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const SECRET_PASS = "anjaymabar123"; // Password sederhana di frontend

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASS) {
      setIsAuthorized(true);
      setPassError("");
    } else {
      setPassError("Password salah!");
      setTimeout(() => setPassError(""), 2000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center font-sans p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-2xl dark:shadow-none"
        >
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-blue-500/20">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            Restricted Area
          </h1>
          <p className="text-gray-500 dark:text-zinc-500 text-center mb-8 text-sm">
            Please enter the security code to proceed
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-mono text-black dark:text-white"
                autoFocus
              />
            </div>

            <AnimatePresence mode="wait">
              {passError && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-xs font-medium text-center"
                >
                  {passError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98]"
            >
              Confirm Identity
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans p-6 sm:p-12">
      <div className="max-w-xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <Settings className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Internal Settings
              </h1>
              <p className="text-gray-500 dark:text-zinc-500 text-sm">
                Update application status and services
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-gray-400 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </header>

        <div className="space-y-6">
          {/* Telegram Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-colors ${config.telegramDisabled ? "bg-red-600/20 text-red-400 border border-red-500/30" : "bg-green-600/20 text-green-400 border border-green-500/30"}`}
                >
                  <BellOff className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    Telegram Notifications
                  </h2>
                  <p className="text-gray-500 dark:text-zinc-500 text-sm">
                    {config.telegramDisabled
                      ? "Notifications are currently DISABLED"
                      : "Notifications are active"}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setConfig({
                    ...config,
                    telegramDisabled: !config.telegramDisabled,
                  })
                }
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${config.telegramDisabled ? "bg-red-600" : "bg-zinc-700"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${config.telegramDisabled ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>
          </motion.div>

          {/* Web Access Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-colors ${config.webDisabled ? "bg-red-600/20 text-red-400 border border-red-500/30" : "bg-green-600/20 text-green-400 border border-green-500/30"}`}
                >
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    Web Maintenance Mode
                  </h2>
                  <p className="text-gray-500 dark:text-zinc-500 text-sm">
                    {config.webDisabled
                      ? "Web is currently LOCKED with modal"
                      : "Web is publicly accessible"}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setConfig({ ...config, webDisabled: !config.webDisabled })
                }
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${config.webDisabled ? "bg-red-600" : "bg-zinc-700"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${config.webDisabled ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>
          </motion.div>

          <footer className="pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Configuration
                </>
              )}
            </button>
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 text-center font-medium ${message.includes("failed") ? "text-red-400" : "text-green-400"}`}
              >
                {message}
              </motion.p>
            )}
          </footer>
        </div>

        <div className="mt-20 border-t border-gray-100 dark:border-zinc-900 pt-8 text-center">
          <Shield className="w-8 h-8 text-gray-200 dark:text-zinc-800 mx-auto mb-2" />
          <p className="text-gray-400 dark:text-zinc-700 text-[10px] tracking-widest uppercase">
            Admin Security Protocol v1.0.2
          </p>
        </div>
      </div>
    </div>
  );
}
