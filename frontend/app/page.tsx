// app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { FiArrowRight, FiBarChart2, FiBookOpen, FiCreditCard, FiFileText, FiGrid, FiUser } from "react-icons/fi";
import type { IconType } from "react-icons";

const quickLinks: Array<{
  title: string;
  desc: string;
  href: string;
  icon: IconType;
}> = [
  { title: "For Students", desc: "Student landing page", href: "/students", icon: FiBookOpen },
  { title: "For Recruiters", desc: "Recruiter landing page", href: "/recruiters", icon: FiBarChart2 },
  { title: "Pricing", desc: "Choose your plan", href: "/pricing", icon: FiCreditCard },
  { title: "Sign In", desc: "Access your workspace", href: "/auth", icon: FiUser },
  { title: "Dashboard", desc: "Track your progress", href: "/dashboard", icon: FiGrid },
  { title: "AI Interview", desc: "Start practice session", href: "/ai-interview", icon: FiBookOpen },
  { title: "LinkedIn Optimizer", desc: "Improve profile quality", href: "/linkedin-optimizer", icon: FiBarChart2 },
  { title: "Resume Analyzer", desc: "Check ATS compatibility", href: "/resume-analyzer", icon: FiFileText },
];

export default function Home() {
  return (
    <main className="bg-[#030712] text-white">
      <Navbar />
      <Hero />

      {/* Quick Navigation */}
      <section
        id="quick-navigation"
        aria-labelledby="quick-nav-heading"
        className="mx-auto max-w-7xl px-6 pb-16 pt-6 sm:pb-20"
      >
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="quick-nav-heading" className="text-3xl font-semibold text-white md:text-4xl">
              Quick Navigation
            </h2>
            <p className="mt-2 text-sm text-[#98a7cb] md:text-base">
              Open any section in one click.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/auth"
              prefetch
              aria-label="Start now and sign in"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-[#dbe7ff] transition hover:border-blue-300/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Start Now
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              href="/pricing"
              prefetch
              aria-label="View pricing plans"
              className="inline-flex items-center justify-center rounded-xl border border-blue-400/40 bg-[linear-gradient(145deg,#081327_0%,#0b1730_100%)] px-4 py-2 text-sm text-blue-200 transition hover:border-blue-500/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              View Pricing
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                aria-label={`Go to ${item.title}`}
                className="group rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10">
                    <Icon className="text-blue-200" size={22} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-blue-200">{item.title}</p>
                    <p className="mt-1 text-sm text-[#aab8d8]">{item.desc}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#7f92be]">Open</span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#dbe7ff] transition group-hover:text-white">
                    <FiArrowRight />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-20" aria-labelledby="features-heading">
        <div className="mb-8 text-center">
          <h3 id="features-heading" className="text-2xl font-semibold text-white md:text-3xl">
            Everything you need
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#98a7cb] md:text-base">
            EchoHire combines AI interviews, ATS resume analysis, and LinkedIn optimization in one clean flow.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "AI Interviewer",
              body: "Practice adaptive questions with a guided session and quick end controls.",
              color: "from-blue-500/20 to-indigo-700/20",
              href: "/ai-interview",
            },
            {
              title: "Resume + ATS",
              body: "Get compatibility insights and focus on the keywords recruiters expect.",
              color: "from-cyan-500/20 to-blue-700/20",
              href: "/resume-analyzer",
            },
            {
              title: "LinkedIn Optimizer",
              body: "Improve your profile with recommendations and an easy apply flow.",
              color: "from-purple-500/20 to-indigo-700/20",
              href: "/linkedin-optimizer",
            },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              prefetch
              aria-label={`Learn more about ${f.title}`}
              className="group rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 transition hover:-translate-y-0.5 hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <div className={`mb-4 h-12 w-12 rounded-xl border border-white/10 bg-gradient-to-br ${f.color}`} />
              <h4 className="text-lg font-semibold text-blue-200">{f.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#aab8d8]">{f.body}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-[#dbe7ff] transition group-hover:text-white">
                Learn more <FiArrowRight className="ml-2" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/auth"
            prefetch
            aria-label="Get started for free"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] px-6 py-3 text-base font-medium text-white shadow-[0_10px_30px_rgba(39,131,255,0.25)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Get Started For Free
            <FiArrowRight className="ml-2" />
          </Link>
          <Link
            href="/dashboard"
            prefetch
            aria-label="Go to dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-base font-medium text-[#dbe7ff] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Go to Dashboard
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </main>
  );
}
