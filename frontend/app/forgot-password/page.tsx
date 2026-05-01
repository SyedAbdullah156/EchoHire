"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailSchema = z.string().email("Please enter a valid email address.");
    const parsed = emailSchema.safeParse(email);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset email");
      }

      setIsSent(true);
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-[#227dff]/30 flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Animated Abstract Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: ["-10%", "10%", "-10%"],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[#227dff]/20 rounded-full blur-[140px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
            x: ["10%", "-10%", "10%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#332989]/30 rounded-full blur-[160px]"
        />
      </div>

      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg bg-[linear-gradient(145deg,rgba(7,20,43,0.7)_0%,rgba(11,23,48,0.5)_100%)] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col"
        >
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Reset Password
            </h1>
            <p className="text-[#98a7cb] text-base">
              {isSent 
                ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {!isSent ? (
            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  className="w-full min-h-[48px] rounded-xl border border-white/10 bg-[#070d1a] px-4 py-3 text-base outline-none placeholder:text-[#5c667f] transition-all focus:border-[#227dff] focus:ring-2 focus:ring-[#227dff]/30 text-[#dbe7ff]"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="block w-full min-h-[48px] rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] py-3 text-center text-base font-medium text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSent(false)}
              className="block w-full min-h-[48px] rounded-xl border border-white/10 bg-[#030712]/50 py-3 text-center text-base font-medium text-[#dbe7ff] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff]"
            >
              Try another email
            </button>
          )}

          <div className="mt-8 text-center text-sm text-[#7f92be]">
            Remember your password?{" "}
            <Link href="/auth" className="text-[#227dff] hover:text-[#5f9bff] transition-colors font-medium">
              Back to Login
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
