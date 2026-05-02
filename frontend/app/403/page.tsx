"use client";

import { motion } from "framer-motion";
import { FiShieldOff, FiArrowLeft, FiHome } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full text-center space-y-10"
        >
          {/* Flat 403 Graphic */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-[10rem] font-black text-surface-2 leading-none select-none">403</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-4xl">
                  <FiShieldOff />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black text-white tracking-tight">Access Restricted</h1>
            <p className="text-text-secondary leading-relaxed max-w-md mx-auto">
              You do not have the required permissions to view this zone. This incident has been logged for security review.
            </p>
          </div>

          {/* Action Buttons (Flat Design) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/"
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-surface-1 border border-border-medium text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-surface-2 active:scale-95"
            >
              <FiHome /> Return Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-primary-hover active:scale-95"
            >
              <FiArrowLeft /> Go Back
            </button>
          </div>
        </motion.div>
      </main>

      {/* Decorative Background Elements (Strictly Flat) */}
      <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 h-96 w-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
}
