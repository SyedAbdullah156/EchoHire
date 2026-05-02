"use client";

import { useState } from "react";
import { 
  FiSettings, 
  FiBell, 
  FiLock, 
  FiDatabase, 
  FiMonitor, 
  FiChevronRight,
  FiSave,
  FiRefreshCw
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    { id: "general", label: "General Settings", icon: FiSettings, desc: "Platform name, timezone, and regional settings." },
    { id: "security", label: "Security & Auth", icon: FiLock, desc: "Password policies, 2FA, and session management." },
    { id: "notifications", label: "Notifications", icon: FiBell, desc: "System alerts, email templates, and push notifications." },
    { id: "database", label: "Data Management", icon: FiDatabase, desc: "Backups, cleanup tasks, and export tools." },
    { id: "appearance", label: "Platform Branding", icon: FiMonitor, desc: "Themes, logos, and custom CSS overrides." },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Settings</h1>
          <p className="text-text-muted mt-1 font-medium">Configure global platform parameters and system behavior.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 w-fit">
          <FiSave size={18} />
          Save Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-start gap-4 p-5 rounded-[2rem] border transition-all text-left ${
                activeSection === section.id 
                  ? "bg-primary/10 border-primary/20 text-white" 
                  : "bg-surface-2 border-white/5 text-text-muted hover:border-white/10 hover:text-white"
              }`}
            >
              <div className={`mt-1 p-2.5 rounded-xl ${activeSection === section.id ? "bg-primary text-white" : "bg-surface-1 border border-white/10"}`}>
                <section.icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{section.label}</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{section.desc}</p>
              </div>
              <FiChevronRight className={`mt-1.5 transition-transform ${activeSection === section.id ? "rotate-90 text-primary" : "text-slate-600"}`} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-surface-2 border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white capitalize">{activeSection.replace('-', ' ')}</h2>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-2">
                <FiRefreshCw />
                Reset to Default
              </button>
            </div>

            <div className="space-y-8">
              {/* Mock Settings Fields */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Platform Instance Name</label>
                <input 
                  defaultValue="EchoHire Production"
                  className="w-full h-14 bg-surface-1 border border-white/10 rounded-2xl px-6 text-sm text-white focus:border-primary/50 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Support Email</label>
                  <input 
                    defaultValue="support@echohire.ai"
                    className="w-full h-14 bg-surface-1 border border-white/10 rounded-2xl px-6 text-sm text-white focus:border-primary/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Timezone</label>
                  <select className="w-full h-14 bg-surface-1 border border-white/10 rounded-2xl px-6 text-sm text-white focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>GMT (Greenwich Mean Time)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-1 border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Maintenance Mode</h4>
                    <p className="text-xs text-text-muted mt-1">Temporarily disable user access for system updates.</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-slate-800 relative cursor-pointer group">
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-slate-500 transition-all group-hover:bg-slate-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-1 border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Automatic Backups</h4>
                    <p className="text-xs text-text-muted mt-1">Schedule daily database backups to cloud storage.</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
