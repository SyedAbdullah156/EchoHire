"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { FiGrid, FiUsers, FiMessageSquare, FiSettings, FiLogOut, FiActivity } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/auth/actions";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", icon: FiGrid, href: "/admin/dashboard" },
    { label: "System Health", icon: FiActivity, href: "/admin/health" },
    { label: "User Management", icon: FiUsers, href: "/admin/users" },
    { label: "Support Tickets", icon: FiMessageSquare, href: "/admin/dashboard/ticketing" },
    { label: "Settings", icon: FiSettings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 lg:p-8 lg:flex-row gap-8">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-8">
        <div className="px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black">
              EH
            </div>
            <span className="text-xl font-bold text-white">Admin<span className="text-primary">Portal</span></span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => logoutAction()}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-400/10 transition-all font-bold text-sm"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
