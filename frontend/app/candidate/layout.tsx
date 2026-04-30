"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import DashboardSidebar from "@/components/DashboardSidebar";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    <div className="min-h-screen bg-background flex flex-col p-4 lg:p-8 lg:flex-row gap-8">
      
      {/* --- Sidebar --- */}
      <DashboardSidebar active={activeKey} />

      {/* --- Main Content Shell --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border-medium/60 mb-6 rounded-3xl">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search assessments, skills, or insights..." 
                className="w-full h-12 bg-surface-2 border border-border-medium rounded-2xl pl-12 pr-4 text-sm text-foreground placeholder:text-text-muted focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-8">
            <ThemeToggle />
            <NotificationBell />

            {/* Avatar — profile picture or initials fallback */}
            <Link 
              href="/candidate/profile"
              className="h-12 w-12 rounded-2xl overflow-hidden flex items-center justify-center font-black text-foreground cursor-pointer active:scale-95 transition-transform border border-border-medium shrink-0"
            >
              {avatarDataUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={avatarDataUrl}
                    alt={name || "Profile"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="bg-primary h-full w-full flex items-center justify-center text-sm">
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
