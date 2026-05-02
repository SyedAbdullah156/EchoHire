"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { FiSearch, FiBell } from "react-icons/fi";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeKey = pathname.split('/').pop() || "dashboard";
  const { name, avatarDataUrl } = useUserProfile();

  // Compute initials from name, fall back to "ME"
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "ME";

  return (
    <div className="min-h-screen bg-[#050b18] flex flex-col p-4 lg:p-8 lg:flex-row gap-8">
      
      {/* --- Sidebar --- */}
      <DashboardSidebar active={activeKey} />

      {/* --- Main Content Shell --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050b18]">
        
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-[#050b18]/80 backdrop-blur-md border-b border-slate-800/60 mb-6 rounded-3xl">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search assessments, skills, or insights..." 
                className="w-full h-12 bg-[#0d162a] border border-slate-800 rounded-2xl pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-8">
            <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#0d162a] border border-slate-800 text-slate-500 hover:text-white transition-all relative">
              <FiBell />
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            {/* Avatar — profile picture or initials fallback */}
            <Link 
              href="/candidate/profile"
              className="h-12 w-12 rounded-2xl overflow-hidden flex items-center justify-center font-black text-white cursor-pointer active:scale-95 transition-transform border border-slate-800 shrink-0"
            >
              {avatarDataUrl ? (
                <img
                  src={avatarDataUrl}
                  alt={name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="bg-blue-600 h-full w-full flex items-center justify-center text-sm">
                  {initials}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
