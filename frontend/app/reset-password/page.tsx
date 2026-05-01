"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/auth");
    }
  }, [token, router]);

  const passwordChecks = useMemo(() => {
    return [
      {
        label: "8-128 characters",
        valid: password.length >= 8 && password.length <= 128,
      },
      {
        label: "At least one uppercase letter",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "At least one lowercase letter",
        valid: /[a-z]/.test(password),
      },
      {
        label: "At least one number",
        valid: /[0-9]/.test(password),
      },
      {
        label: "At least one special character",
        valid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }, [password]);

  const passwordIsValid = passwordChecks.every((check) => check.valid);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) return;

    if (!passwordIsValid) {
      toast.error("Please ensure your password meets all requirements.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      toast.success("Password reset successfully. Please login with your new password.");
      router.push("/auth");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reset password";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full min-h-[48px] rounded-xl border border-white/10 bg-[#070d1a] px-4 py-3 text-base outline-none placeholder:text-[#5c667f] transition-all focus:border-[#227dff] focus:ring-2 focus:ring-[#227dff]/30 text-[#dbe7ff]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg bg-[linear-gradient(145deg,rgba(7,20,43,0.7)_0%,rgba(11,23,48,0.5)_100%)] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col"
    >
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Create New Password
        </h1>
        <p className="text-[#98a7cb] text-base">
          Please enter your new password below.
        </p>
      </div>

      <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className={inputClassName}
            placeholder="Enter your new password"
          />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-white/5 bg-[#030712]/50 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7f92be]">
                  Password rules
                </p>
                <div className="grid gap-2.5">
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center gap-2.5 text-sm transition-colors ${check.valid ? "text-[#227dff]" : "text-[#7f92be]"}`}
                    >
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${check.valid ? "bg-[#227dff]/20 text-[#227dff]" : "bg-white/5 text-[#5c667f]"}`}
                      >
                        {check.valid ? "✓" : ""}
                      </span>
                      {check.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#dbe7ff]">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className={inputClassName}
            placeholder="Confirm your new password"
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-2 text-sm text-red-400">Passwords do not match.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !passwordIsValid || !passwordsMatch || !token}
          className="mt-4 block w-full min-h-[48px] rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] py-3 text-center text-base font-medium text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
