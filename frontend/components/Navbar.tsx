"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiMenu, FiX, FiHome, FiPieChart, FiCpu, FiLinkedin, FiGrid } from "react-icons/fi";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // HCI: Adding scroll detection to change navbar density
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: <FiHome /> },
    { label: "Pricing", href: "/pricing", icon: <FiPieChart /> },
    { label: "AI Interview", href: "/ai-interview", icon: <FiCpu /> },
    { label: "Optimizer", href: "/linkedin-optimizer", icon: <FiLinkedin /> },
  ];

  return (
    <div className={`fixed top-0 z-[1000] w-full transition-all duration-300 ${scrolled ? "pt-2" : "pt-6"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <nav className={`flex items-center justify-between rounded-2xl border transition-all duration-300 px-4 py-2.5 md:px-6 ${
          scrolled 
          ? "border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl" 
          : "border-white/20 bg-white/5 backdrop-blur-md"
        }`}>
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <span className="text-sm font-black text-white">EH</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Echo<span className="text-blue-400">Hire</span>
            </span>
          </Link>

          {/* Desktop Nav - Using High Contrast for Active Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-blue-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {pathname.startsWith('/dashboard') || pathname === '/profile' ? (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white md:hidden p-2">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer - HCI: Using Full Screen Overlay to prevent background interaction */}
      {isOpen && (
        <div className="fixed inset-0 z-[1100] md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[280px] bg-[#030712] border-l border-white/10 p-6">
            <div className="flex flex-col gap-6 pt-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-lg font-medium text-slate-300 hover:text-blue-400"
                >
                  <span className="text-blue-500/50">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/5" />
              <Link 
                href="/auth" 
                className="w-full rounded-xl bg-blue-600 py-3 text-center font-bold text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal - HCI: Modal Focus for High-Stakes Actions */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0f172a] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <FiLogOut size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
            <p className="mt-2 text-slate-400">Are you sure you want to end your session?</p>
            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={() => router.push('/auth')}
                className="w-full rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-500 transition-colors"
              >
                Yes, Log Out
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full rounded-xl bg-white/5 py-3 font-semibold text-slate-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}