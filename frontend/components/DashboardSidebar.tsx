"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBarChart2,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiX,
} from "react-icons/fi";

type SidebarItem = {
  key: string;
  label: string;
  icon: IconType;
  href: string;
};

type DashboardSidebarProps = {
  active: string;
};

const mainItems: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: FiGrid, href: "/dashboard" },
  { key: "ai-interview", label: "AI Interview", icon: FiBookOpen, href: "/ai-interview" },
  { key: "resume-analyzer", label: "Resume Analyzer", icon: FiFileText, href: "/resume-analyzer" },
  { key: "linkedin-optimizer", label: "LinkedIn Optimizer", icon: FiBarChart2, href: "/linkedin-optimizer" },
];

const accountItems: SidebarItem[] = [
  { key: "profile", label: "Profile", icon: FiUser, href: "/profile" },
  { key: "settings", label: "Settings", icon: FiSettings, href: "/settings" },
  { key: "support", label: "Help & Support", icon: FiHelpCircle, href: "/support" },
  { key: "logout", label: "Logout", icon: FiLogOut, href: "/auth" },
];

type MenuItemProps = {
  item: SidebarItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
};

function MenuItem({ item, isActive, collapsed, onNavigate }: MenuItemProps) {
  const Icon = item.icon;

  return (
    <div className="group relative">
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200 active:scale-[0.98] md:text-base ${
          collapsed ? "justify-center" : "gap-3"
        } ${
          isActive
            ? "bg-gradient-to-r from-[#2a7df7] to-[#332b8c] text-white shadow-[0_8px_24px_rgba(42,125,247,0.3)]"
            : "text-[#aeb7cc] hover:bg-[#17243f] hover:text-white"
        }`}
      >
        <Icon className="shrink-0" size={18} />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>

      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 -translate-y-1/2 rounded-md border border-[#334770] bg-[#0d162a] px-2 py-1 text-xs text-[#dbe7ff] opacity-0 shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition group-hover:opacity-100">
          {item.label}
        </span>
      )}
    </div>
  );
}

type SidebarShellProps = {
  active: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
};

function SidebarShell({
  active,
  collapsed,
  onToggleCollapsed,
  onNavigate,
  mobile = false,
}: SidebarShellProps) {
  return (
    <aside
      className={`rounded-2xl border border-white/30 bg-black/20 p-3 text-[#d2d9ea] shadow-[0_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(59,130,246,0.28)] backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-[88px]" : "w-[290px]"
      } ${mobile ? "h-full w-[290px] rounded-none border-y-0 border-l-0" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
          <h2 className="text-xl font-bold tracking-tight text-[#57a2ff]">EchoHire</h2>
          <p className="text-xs text-[#7f96c2]">Navigation</p>
        </div>

        <button
          type="button"
          onClick={onToggleCollapsed}
          className="rounded-lg border border-white/20 bg-black/30 p-2 text-[#c7d7f8] transition hover:border-blue-300/50 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      <nav className="space-y-2">
        {mainItems.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            isActive={active === item.key}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-5 border-t border-white/10 pt-4">
        <nav className="space-y-2">
          {accountItems.map((item) => (
            <MenuItem
              key={item.key}
              item={item}
              isActive={active === item.key}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default function DashboardSidebar({ active }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-black/20 px-4 py-2 text-sm text-[#dbe7ff] shadow-[0_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(59,130,246,0.25)] transition hover:border-blue-300/50"
        >
          <FiMenu />
          Open Menu
        </button>
      </div>

      <div className="hidden lg:block lg:shrink-0">
        <SidebarShell
          active={active}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        />
      </div>

      <div
        className={`fixed inset-0 z-[1200] transition-all duration-200 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/55"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
        <div
          className={`absolute left-0 top-0 h-full w-[84vw] max-w-[320px] transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-end bg-transparent p-3">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-white/20 bg-black/30 p-2 text-[#c7d7f8]"
              aria-label="Close sidebar"
            >
              <FiX size={16} />
            </button>
          </div>
          <SidebarShell
            active={active}
            collapsed={false}
            onToggleCollapsed={() => undefined}
            onNavigate={() => setMobileOpen(false)}
            mobile
          />
        </div>
      </div>
    </>
  );
}
