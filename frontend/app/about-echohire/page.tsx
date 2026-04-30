import Link from "next/link";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiMessageSquare,
  FiCpu,
  FiTarget,
  FiZap
} from "react-icons/fi";

const highlights = [
  {
    title: "AI Interview Practice",
    desc: "Adaptive technical and behavioral simulations that evolve based on your responses.",
    icon: FiMessageSquare,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Resume + ATS Analysis",
    desc: "Deep-scan your resume against industry-standard ATS algorithms to find hidden gaps.",
    icon: FiFileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    title: "Profile Optimization",
    desc: "Actionable intelligence to transform your LinkedIn from a resume into a lead magnet.",
    icon: FiBarChart2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
];

export default function AboutEchoHirePage() {
  return (
    <main className="min-h-screen bg-background text-[#e2e8f0] selection:bg-primary/30 antialiased">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        
        {/* Hero Section - HCI: Establishing Brand Identity */}
        <header className="relative overflow-hidden rounded-[2.5rem] border border-border-medium bg-surface-2/50 p-8 md:p-16 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-600/10 blur-[100px]" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-blue-500/20">
              <FiCpu className="animate-spin-slow" /> Our Mission
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:max-w-4xl">
              Career Growth, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Powered by Practical AI.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {"EchoHire isn't just another job board. We are a focused laboratory for career advancement, designed to bridge the gap between \"applying\" and \"landing\" through high-fidelity AI simulation."}
            </p>
          </div>
        </header>

        {/* Feature Grid - HCI: Recognition and Scannability */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group relative rounded-3xl border border-border-subtle bg-surface-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#3b82f6]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ${item.color} border border-border-subtle transition-transform group-hover:scale-110`}>
                  <Icon size={28} />
                </div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.desc}</p>
              </article>
            );
          })}
        </div>

        {/* Differentiation Section - HCI: Social Proof & Clarity */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-border-subtle bg-gradient-to-br from-[#0d162a] to-[#050b18] p-10">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <FiTarget className="text-primary" />
              The EchoHire Difference
            </h3>
            <p className="mt-4 text-text-secondary">We prioritize clarity over complexity. Our workflow is built for the modern engineer who values efficiency.</p>
            
            <ul className="mt-8 space-y-4">
              {[
                { title: "Iterative Learning", desc: "Prepare, analyze, improve, and repeat in a sandbox environment." },
                { title: "Clean Architecture", desc: "A modern UI designed specifically for speed and cognitive ease." },
                { title: "Signal over Noise", desc: "Get actionable insights instead of data-heavy, confusing reports." },
              ].map((point) => (
                <li key={point.title} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <FiCheckCircle size={14} />
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">{point.title}</span>
                    <span className="text-sm text-text-secondary">{point.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-dashed border-border-subtle p-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
               <FiZap size={40} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Ready to Level Up?</h3>
            <p className="mt-4 text-text-secondary">Join the next generation of candidates using AI to master the interview process.</p>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth"
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#227dff] to-[#332989] px-8 py-4 text-sm font-bold text-foreground shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Get Started Now
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-border-medium bg-surface-2 px-8 py-4 text-sm font-bold text-[#dbe7ff] transition-all hover:bg-surface-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}