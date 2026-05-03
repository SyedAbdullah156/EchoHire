"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronRight, X, Key, Shield, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";

export default function SecuritySettings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMFAModal, setShowMFAModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();
  
  const mfaActive = user?.mfaEnabled ?? false;
  
  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // MFA state
  const [mfaStep, setMfaStep] = useState(1);
  const [mfaSecret, setMfaSecret] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully.");
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message || "Failed to update password.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setupMFA = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/mfa/setup", { method: "POST" });
      const result = await res.json();
      if (res.ok) {
        setMfaSecret(result.data.otpauth_url);
        setMfaStep(2);
      } else {
        toast.error("Failed to initiate MFA setup.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyMFA = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: mfaCode }),
      });
      if (res.ok) {
        toast.success("MFA enabled successfully!");
        await refreshUser();
        setShowMFAModal(false);
        setMfaStep(1);
      } else {
        toast.error("Invalid verification code.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disableMFA = async () => {
    if (!confirm("Are you sure you want to disable MFA? This reduces your account security.")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/mfa/disable", { method: "POST" });
      if (res.ok) {
        toast.success("MFA disabled successfully.");
        await refreshUser();
        setShowMFAModal(false);
      } else {
        toast.error("Failed to disable MFA.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="rounded-3xl border border-[#243253] bg-[#0d162a] p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-emerald-400" size={24} />
          <h3 className="text-xl font-bold text-white">Security Status</h3>
        </div>
        <div className="space-y-4">
          <button 
            onClick={() => setShowMFAModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a1223] border border-[#32466f] hover:border-blue-500 transition-all group"
          >
            <span className="text-sm text-slate-300">Google Authenticator (MFA)</span>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${mfaActive ? "text-emerald-500 bg-emerald-500/10" : "text-slate-500 bg-slate-500/10"}`}>
                {mfaActive ? "ACTIVE" : "INACTIVE"}
              </span>
              <ChevronRight size={16} className="text-[#4a5d89] group-hover:text-white" />
            </div>
          </button>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a1223] border border-[#32466f] hover:border-blue-500 transition-all group"
          >
            <span className="text-sm text-slate-300">Update Password</span>
            <ChevronRight size={16} className="text-[#4a5d89] group-hover:text-white" />
          </button>
        </div>
      </section>

      {/* Update Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0d162a] border border-[#243253] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <Key size={20} className="text-blue-400" /> Change Password
              </h4>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Current Password</label>
                <input 
                  type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-[#050b18] border border-[#243253] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Password</label>
                <input 
                  type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#050b18] border border-[#243253] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Confirm New Password</label>
                <input 
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#050b18] border border-[#243253] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all disabled:opacity-50 mt-4"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MFA Modal */}
      {showMFAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0d162a] border border-[#243253] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-emerald-400" /> Multi-Factor Auth
              </h4>
              <button onClick={() => setShowMFAModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
            </div>

            {mfaActive ? (
              <div className="text-center space-y-6 py-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                   <ShieldCheck size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold">MFA is currently active</p>
                  <p className="text-xs text-slate-400">Your account is protected by an additional security layer.</p>
                </div>
                <button 
                  onClick={disableMFA} disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Disable MFA
                </button>
              </div>
            ) : (
              <>
                {mfaStep === 1 && (
                  <div className="text-center space-y-6 py-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                       <Smartphone size={40} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-white font-bold">Secure your account</p>
                      <p className="text-xs text-slate-400">Use Google Authenticator or Authy to scan a QR code and generate secure login codes.</p>
                    </div>
                    <button 
                      onClick={setupMFA} disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all"
                    >
                      {isSubmitting ? "Initializing..." : "Start Setup"}
                    </button>
                  </div>
                )}

                {mfaStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-center p-4 bg-white rounded-2xl">
                      <QRCodeSVG value={mfaSecret} size={200} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Step 1: Scan the QR code</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Open your authenticator app and scan this code. Then, enter the 6-digit code below to verify.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center block">Verification Code</label>
                      <input 
                        type="text" maxLength={6} placeholder="000000"
                        value={mfaCode} onChange={(e) => setMfaCode(e.target.value)}
                        className="w-full bg-[#050b18] border border-[#243253] rounded-xl px-4 py-4 text-center text-2xl font-black tracking-[0.5em] text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button 
                      onClick={verifyMFA} disabled={isSubmitting || mfaCode.length !== 6}
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Verifying..." : "Enable MFA"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
