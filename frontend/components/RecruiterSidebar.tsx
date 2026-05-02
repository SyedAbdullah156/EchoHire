"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiX,
  FiBriefcase,
  FiUsers,
  FiPlus
} from "react-icons/fi";
import { usePathname } from "next/navigation";

type SidebarItem = {
  key: string;
  label: string;
  icon: IconType;
  href: string;
};

const recruiterItems: SidebarItem[] = [
  { key: "dashboard", label: "Overview", icon: FiGrid, href: "/recruiter/dashboard" },
  { key: "jobs", label: "Job Postings", icon: FiBriefcase, href: "/recruiter/jobs" },
  { key: "candidates", label: "Candidates", icon: FiUsers, href: "/recruiter/candidates" },
  { key: "new-job", label: "Create Job", icon: FiPlus, href: "/recruiter/jobs/new" },
];

const accountItems: SidebarItem[] = [
  { key: "settings", label: "Settings", icon: FiSettings, href: "/recruiter/settings" },
  { key: "support", label: "Support", icon: FiHelpCircle, href: "/support" },
  { key: "logout", label: "Logout", icon: FiLogOut, href: "/auth" },
];

function MenuItem({ item, isActive, collapsed, onNavigate }: { 
  item: SidebarItem; 
  isActive: boolean; 
  collapsed: boolean; 
  onNavigate?: () => void 
}) {
  const Icon = item.icon;

  if (item.key === "logout") {
    return (
      <button
        onClick={async () => {
          if (onNavigate) onNavigate();
          try {
            await fetch("/api/auth/logout", { method: "POST" });
          } finally {
            localStorage.removeItem("echohire-token");
            window.location.href = "/auth";
          }
        }}
        className={`group relative flex w-full items-center rounded-2xl px-3 py-3 transition-all duration-300 ${
          collapsed ? "justify-center" : "gap-4"
        } text-slate-400 hover:bg-rose-500/10 hover:text-rose-400`}
      >
        <div className={`flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 text-slate-500 group-hover:text-rose-400`}>
          <Icon size={20} />
        </div>

        {!collapsed && (
          <span className={`text-sm font-semibold tracking-wide transition-opacity duration-300 opacity-80 group-hover:text-white`}>
            {item.label}
          </span>
        )}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group relative flex items-center rounded-2xl px-3 py-3 transition-all duration-300 ${
        collapsed ? "justify-center" : "gap-4"
      } ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
      )}

      <div className={`flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
        isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
      }`}>
        <Icon size={20} />
      </div>

      {!collapsed && (
        <span className={`text-sm font-semibold tracking-wide transition-opacity duration-300 ${
          isActive ? "text-white" : "opacity-80"
        }`}>
          {item.label}
        </span>
      )}
    </Link>
  );
}

function SidebarShell({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  mobile = false,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col border border-slate-800/60 bg-[#070d1a]/60 backdrop-blur-xl transition-all duration-500 ease-in-out ${
        collapsed ? "w-[88px]" : "w-[280px]"
      } ${
        mobile
          ? "h-full w-[280px] rounded-none"
          : "h-[calc(100vh-4rem)] rounded-[2.5rem] sticky top-8"
      }`}
    >
      {/* Brand Section */}
      <div className="p-6">
        <Link
          href="/recruiter/dashboard"
          onClick={onNavigate}
          className={`flex items-center gap-3 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary">
            <span className="text-sm font-black text-white">RE</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-white">Recruiter</h2>
              <div className="h-0.5 w-6 rounded-full bg-primary/50" />
            </div>
          )}
        </Link>
      </div>

      {/* Nav Section */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
        <div>
          {!collapsed && <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Management</p>}
          <nav className="space-y-1">
            {recruiterItems.map((item) => (
              <MenuItem
                key={item.key}
                item={item}
                isActive={pathname === item.href}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && <p className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Account</p>}
          <nav className="space-y-1">
            {accountItems.map((item) => (
              <MenuItem
                key={item.key}
                item={item}
                isActive={pathname === item.href}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer / Toggle */}
      {!mobile && (
        <div className="p-6">
          <button
            onClick={onToggleCollapsed}
            className="flex w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 py-3 text-slate-500 transition-all hover:bg-slate-800 hover:text-white"
          >
            {collapsed ? <FiChevronRight /> : <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><FiChevronLeft /> Collapse</div>}
          </button>
        </div>
      )}
    </aside>
  );
}

export default function RecruiterSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setCollapsed(window.innerWidth < 1280);
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <div className="lg:hidden mb-4 px-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#0f172a] px-5 py-3 text-sm font-bold text-white"
        >
          <FiMenu className="text-primary" /> Menu
        </button>
      </div>

      <div className="hidden lg:block lg:shrink-0">
        <SidebarShell
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[2000] lg:hidden transition-opacity duration-300 ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute left-0 top-0 h-full transition-transform duration-500 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <SidebarShell
              collapsed={false}
              onToggleCollapsed={() => undefined}
              onNavigate={() => setMobileOpen(false)}
              mobile
            />
            <button 
                onClick={() => setMobileOpen(false)}
                className="absolute right-[-50px] top-6 rounded-xl bg-slate-900 border border-slate-800 p-3 text-white"
            >
                <FiX size={20} />
            </button>
        </div>
      </div>
    </>
  );
}
