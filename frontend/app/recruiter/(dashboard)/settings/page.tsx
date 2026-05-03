"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  BellRing, 
  User, 
  ArrowLeft, 
  AlertTriangle,
  Settings as SettingsIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SecuritySettings from "@/components/SecuritySettings";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Tab = "account" | "security" | "notifications" | "danger";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // For recruiters, we use the generic user delete if available, 
      // or we might need a specific employee delete.
      // Let's assume a generic one for now or use the candidate one as template.
      const res = await fetch("/api/me", {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Account deleted successfully.");
        await logout();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete account.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: "account", label: "My Account", icon: User },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: BellRing },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link 
          href="/recruiter/dashboard" 
          className="group flex items-center gap-2 text-sm font-medium text-[#9fb1d8] hover:text-white transition-all"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Return to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-[#4a5d89]">
          <span>SERVER STATUS:</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-500">OPERATIONAL</span>
        </div>
      </div>

      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <SettingsIcon className="text-primary" size={32} />
          Settings
        </h1>
        <p className="mt-2 text-[#9fb1d8] max-w-2xl">
          Manage your account preferences, security configurations, and notifications.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? tab.danger 
                      ? "bg-red-500/10 text-red-400" 
                      : "bg-primary/10 text-primary"
                    : "text-[#9fb1d8] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Account Tab */}
              {activeTab === "account" && (
                <section className="rounded-3xl border border-[#243253] bg-[#0d162a]/80 p-8 backdrop-blur-md">
                  <div className="mb-8 border-b border-[#243253] pb-6">
                    <h2 className="text-2xl font-bold text-white">Profile Identity</h2>
                    <p className="text-sm text-[#9fb1d8] mt-1">Manage your public presence and account details.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18] border border-[#243253]">
                    <div className="flex items-center gap-4">
                      {user?.profile?.avatarDataUrl ? (
                        <img src={user.profile.avatarDataUrl} alt="Avatar" className="h-14 w-14 rounded-full border-2 border-[#243253] object-cover" />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white text-lg">{user?.name || "User Name"}</p>
                        <p className="text-sm text-[#9fb1d8]">{user?.email || "user@example.com"}</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </section>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <SecuritySettings />
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <section className="rounded-3xl border border-[#243253] bg-[#0d162a] p-8">
                  <div className="mb-8 border-b border-[#243253] pb-6">
                    <h3 className="text-2xl font-bold text-white">System Alerts</h3>
                    <p className="text-sm text-[#9fb1d8] mt-1">Choose what you want to be notified about.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'email', title: 'Email Updates', desc: 'Receive daily summaries and critical alerts via email.' },
                      { id: 'push', title: 'Push Notifications', desc: 'Get instantly notified on your device.' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-start justify-between cursor-pointer group p-4 rounded-xl bg-[#050b18] border border-[#243253] hover:border-[#32466f] transition-all">
                        <div className="pr-4">
                          <span className="block text-sm font-bold text-white mb-1">{item.title}</span>
                          <span className="block text-xs text-[#9fb1d8]">{item.desc}</span>
                        </div>
                        <div className="relative inline-flex items-center shrink-0 mt-1">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="h-5 w-10 rounded-full bg-[#1e293b] peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-red-400">Danger Zone</h3>
                    <p className="text-sm text-red-200/60 mt-1">Irreversible and destructive actions.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#050b18] border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">Delete Account</h4>
                      <p className="text-xs text-red-200/60 max-w-sm">
                        Deleting your account will permanently erase all projects, resumes, and data. This action cannot be undone.
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={isDeleting}
                      className="whitespace-nowrap rounded-xl bg-red-500/10 border border-red-500/50 px-6 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </button>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DeleteAccountModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
        description="Deleting your recruiter account will permanently erase your company profile, job postings, and all candidate evaluation data. This action is irreversible."
      />
    </div>
  );
}