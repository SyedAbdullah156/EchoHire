"use client";

import React, { useState } from "react";
import { FiLock, FiMail, FiArrowRight, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AccessCodeGateProps {
  interviewId: string;
  onSuccess: () => void;
}

export default function AccessCodeGate({ interviewId, onSuccess }: AccessCodeGateProps) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleRequestCode = async () => {
    setIsSending(true);
    try {
      const res = await fetch("/api/coding/request-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId }),
      });
      if (res.ok) {
        toast.success("A 6-digit access code has been sent to your email.");
      } else {
        toast.error("Failed to send access code. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error("Please enter a valid 6-digit code.");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/coding/verify-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, code }),
      });
      if (res.ok) {
        toast.success("Access granted!");
        onSuccess();
      } else {
        const result = await res.json();
        toast.error(result.message || "Invalid or expired access code.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0d162a] border border-slate-800 rounded-[2.5rem] p-10 space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <FiShield size={40} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Challenge Gate</h2>
          <p className="text-sm text-slate-400">This environment is protected. Verify your identity to continue.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Unique Access Code</label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full h-16 bg-[#050b18] border border-slate-800 rounded-2xl px-6 text-2xl font-black tracking-[0.5em] text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-800 text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || code.length !== 6}
            className="w-full h-16 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? "Verifying..." : "Enter Environment"}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/50 flex flex-col items-center gap-4">
          <p className="text-xs text-slate-500">Didn't receive a code?</p>
          <button
            onClick={handleRequestCode}
            disabled={isSending}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            <FiMail /> {isSending ? "Sending Code..." : "Request New Access Code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
