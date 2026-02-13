"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Hammer } from "lucide-react";

export default function MaintenanceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webDisabled, setWebDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Biarkan halaman settings tetap bisa dibuka walaupun web disabled
  const isSettingsPage = pathname === "/config";

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setWebDisabled(data.webDisabled);
      } catch (err) {
        console.error("Failed to fetch maintenance status", err);
      } finally {
        setLoading(false);
      }
    };

    if (!isSettingsPage) {
      checkConfig();
    } else {
      setLoading(false);
    }
  }, [pathname, isSettingsPage]);

  if (loading) return children;

  if (webDisabled && !isSettingsPage) {
    return (
      <>
        {/* Render children tapi di blur atau di tutup */}
        <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-100 dark:border-red-900/20">
              <Hammer className="w-10 h-10 text-red-500 animate-bounce" />
            </div>

            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              System Maintenance
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We are currently performing scheduled maintenance to improve our
              services. The website will be back online shortly. Thank you for
              your patience.
            </p>

            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 text-left">
              <div className="p-2 bg-zinc-200/50 dark:bg-zinc-800 rounded-lg">
                <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Estimated Time
                </p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Returning in 15-30 minutes
                </p>
              </div>
            </div>

            <div className="pt-8 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-red-300 animate-pulse delay-150" />
              </div>
              <p className="text-[10px] text-zinc-300 dark:text-zinc-700 uppercase font-bold tracking-[0.2em]">
                Maintenance Mode Active
              </p>
            </div>
          </motion.div>
        </div>
        <div className="overflow-hidden h-screen pointer-events-none filter blur-lg grayscale opacity-30">
          {children}
        </div>
      </>
    );
  }

  return children;
}
