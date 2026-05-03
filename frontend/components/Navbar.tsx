"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const linkVariants: Variants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 },
};

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${scrolled
        ? "bg-surface-1/80 backdrop-blur-xl border-b border-border-subtle py-4"
        : "bg-transparent border-b border-transparent py-6"
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary transition-colors group-hover:bg-primary-hover">
            <span className="text-base font-black text-white">EH</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Echo<span className="text-primary">Hire</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold tracking-wide transition-colors ${pathname === link.href ? "text-primary" : "text-text-secondary hover:text-white"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 lg:flex">
          {!loading && user ? (
            <Link
              href={user.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard"}
              className="rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white transition-all hover:bg-primary-hover active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm font-bold text-text-secondary hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white transition-all hover:bg-primary-hover active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-border-medium text-white transition-colors hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[73px] z-[-1] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute left-0 top-full w-full bg-surface-1 border-b border-border-medium lg:hidden overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-8 gap-4">
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={linkVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-3 text-xl font-bold transition-colors ${pathname === link.href ? "text-primary" : "text-text-muted hover:text-white"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={linkVariants} className="mt-6 pt-6 border-t border-border-subtle flex flex-col gap-4">
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-2xl bg-primary py-4 text-center font-bold text-white transition-colors hover:bg-primary-hover"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-2xl border border-border-medium bg-white/5 py-4 text-center font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}