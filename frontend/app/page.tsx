// app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { 
  FiArrowRight, FiBarChart2, FiBookOpen, FiCreditCard, 
  FiFileText, FiGrid, FiTarget, FiZap 
} from "react-icons/fi";
import type { IconType } from "react-icons";

// HCI: Grouping tools by function to help users scan quickly
const quickLinks: Array<{
  title: string;
  desc: string;
  href: string;
  icon: IconType;
  badge?: string;
}> = [
  { title: "AI Interview", desc: "Adaptive practice sessions", href: "/ai-interview", icon: FiBookOpen, badge: "Popular" },
  { title: "Resume Analyzer", desc: "ATS compatibility check", href: "/resume-analyzer", icon: FiFileText },
  { title: "LinkedIn Optimizer", desc: "Profile quality audit", href: "/linkedin-optimizer", icon: FiBarChart2 },
  { title: "For Recruiters", desc: "Talent acquisition tools", href: "/recruiters", icon: FiTarget },
  { title: "Dashboard", desc: "Track your progress", href: "/dashboard", icon: FiGrid },
  { title: "Pricing", desc: "Choose your plan", href: "/pricing", icon: FiCreditCard },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 selection:text-white">
      {/* Structural Components */}
      <Navbar />
      <Hero />

      {/* 
          SECTION 1: QUICK NAVIGATION 
          Principle: Recognition over Recall. 
          The grid layout allows users to find their destination without reading a long list.
      */}
      <section id="quick-navigation" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Quick Navigation
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Jump straight into your workspace and accelerate your career prep.
            </p>
          </div>

          <Link
            href="/auth"
            className="group inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-blue-100 transition-all hover:bg-white/10 hover:border-blue-500/50"
          >
            Start Free Trial
            <FiZap className="ml-2 text-blue-400 transition-transform group-hover:scale-110" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                {item.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                    {item.badge}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition-all group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-50">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-400 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  Launch Tool <FiArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="relative border-t border-white/5 bg-white/[0.01] py-32 overflow-hidden">
        {/* Subtle Decorative Backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Everything you need
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              The all-in-one suite designed to bypass automated filters and land your next role.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "AI Interviewer",
                body: "Adaptive LLM-powered practice sessions with real-time feedback on technical accuracy.",
                color: "from-blue-600/20 to-blue-400/5",
                accent: "group-hover:border-blue-500/50",
                icon: <FiBookOpen size={26} className="text-blue-400" />,
                href: "/ai-interview"
              },
              {
                title: "ATS Resume Scan",
                body: "Analyze your resume against specific job descriptions to find keyword gaps.",
                color: "from-cyan-600/20 to-cyan-400/5",
                accent: "group-hover:border-cyan-500/50",
                icon: <FiFileText size={26} className="text-cyan-400" />,
                href: "/resume-analyzer"
              },
              {
                title: "LinkedIn Audit",
                body: "Professional profile optimization to increase visibility and attract top-tier recruiters.",
                color: "from-purple-600/20 to-purple-400/5",
                accent: "group-hover:border-purple-500/50",
                icon: <FiBarChart2 size={26} className="text-purple-400" />,
                href: "/linkedin-optimizer"
              }
            ].map((f) => (
              <Link 
                key={f.title} 
                href={f.href}
                className={`group relative flex flex-col rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-10 transition-all duration-500 hover:-translate-y-2 ${f.accent} hover:bg-white/[0.04]`}
              >
                <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${f.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                
                <div className="relative z-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-inner">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                    {f.body}
                  </p>
                  <div className="mt-10 flex items-center gap-2 text-sm font-bold text-blue-400">
                    Read Documentation <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 
          SECTION 3: FINAL CALL TO ACTION 
          Principle: Fitts's Law.
          Large, high-contrast button to end the user's journey with a clear goal.
      */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <div className="rounded-[3rem] border border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-transparent p-12 md:p-20">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Ready to ace your next <br /> tech interview?
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Join thousands of developers using AI to sharpen their edge.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="w-full sm:w-auto rounded-2xl bg-blue-600 px-10 py-4 text-lg font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95"
            >
              Get Started Now
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-10 py-4 text-lg font-bold text-white transition hover:bg-white/10 active:scale-95"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      
    </main>
  );
}