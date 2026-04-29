"use client";

import Link from "next/link";
import { FiGithub, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";
import { usePathname } from "next/navigation";

const productLinks = [
  { label: "AI Interview", href: "/ai-interview" },
  { label: "Resume Analyzer", href: "/resume-analyzer" },
  { label: "LinkedIn Optimizer", href: "/linkedin-optimizer" },
  { label: "Pricing", href: "/pricing" },
];

const accountLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Support", href: "/support" },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname !== "/" && pathname !== "/auth" && pathname !== "/students" && pathname !== "/recruiters") return null;

  return (
    <footer className="border-t border-white/10 bg-[radial-gradient(circle_at_20%_0%,#0f1e3d_0%,#040915_45%,#03070f_100%)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-semibold text-white">
              Echo<span className="text-blue-400">Hire</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#aab8d8]">
              Build confidence for real interviews with AI-driven practice, resume optimization, and career insights.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="email"
                aria-label="Email for updates"
                placeholder="Enter email for updates"
                className="w-full rounded-lg border border-[#2f4168] bg-[#081127] px-3 py-2 text-sm text-[#dfe8ff] outline-none placeholder:text-[#6e84b1] focus-visible:ring-2 focus-visible:ring-blue-400/60"
              />
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-3 py-2 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                Join
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-[#d9e5ff]">PRODUCT</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-[#b6c2de]">
              {productLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-[#d9e5ff]">ACCOUNT</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-[#b6c2de]">
              {accountLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-[#8fa0c7] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} EchoHire. All rights reserved.</p>
          <div className="flex items-center gap-4 text-base">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition hover:border-blue-400/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              aria-label="Twitter"
            >
              <FiTwitter />
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition hover:border-blue-400/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition hover:border-blue-400/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              aria-label="Instagram"
            >
              <FiInstagram />
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition hover:border-blue-400/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              aria-label="GitHub"
            >
              <FiGithub />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
