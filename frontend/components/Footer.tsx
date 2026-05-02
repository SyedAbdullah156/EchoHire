"use client";

import Link from "next/link";
import { FiGithub, FiInstagram, FiLinkedin, FiTwitter, FiSend } from "react-icons/fi";
import { usePathname } from "next/navigation";

const footerNavigation = {
  product: [
    { label: "AI Interview", href: "/ai-interview" },
    { label: "Resume Analyzer", href: "/resume-analyzer" },
    { label: "LinkedIn Optimizer", href: "/linkedin-optimizer" },
    { label: "Pricing", href: "/pricing" },
  ],
  account: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
    { label: "Support", href: "/support" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  const pathname = usePathname();

  // HCI: Conditional rendering keeps the UI focused on the task (e.g., hiding footer during a high-stakes AI interview)
  const showFooter = ["/", "/auth", "/features", "/pricing", "/students", "/recruiter", "/about", "/privacy", "/terms", "/contact"].includes(pathname);
  if (!showFooter) return null;

  return (
    <footer className="relative border-t border-white/10 bg-[#030712]">
      {/* Decorative background glow for visual depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">

          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-90">
              Echo<span className="text-blue-500">Hire</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Empowering candidates with AI-driven interview intelligence and career-growth tools.
            </p>

            <form className="mt-6 space-y-2" onSubmit={(e) => e.preventDefault()}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stay Updated</p>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 focus:ring-2 focus:ring-blue-400"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Columns */}
          {Object.entries(footerNavigation).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-100/80">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-slate-400 transition hover:text-white"
                    >
                      <span className="h-px w-0 bg-blue-500 transition-all group-hover:mr-2 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} EchoHire Inc. Built for the future of work.
          </p>

          <div className="flex items-center gap-3">
            {[
              { icon: <FiTwitter />, label: "Twitter" },
              { icon: <FiLinkedin />, label: "LinkedIn" },
              { icon: <FiInstagram />, label: "Instagram" },
              { icon: <FiGithub />, label: "GitHub" },
            ].map((social) => (
              <Link
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-slate-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 hover:-translate-y-1"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}