// components/Hero.tsx
import Link from "next/link";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-[url('/mainpagepic.png')] bg-cover bg-center px-6 md:px-20">
      {/* HCI: Improved Layering for Text Legibility */}
      <div className="absolute inset-0 bg-[#030712]/60 backdrop-brightness-[0.8]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent" />
      
      {/* Decorative Glow */}
      <div className="absolute -left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Next-Gen Career Intelligence
        </div>

        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:leading-[1.1]">
          Master Your Tech Career <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            with AI Intelligence
          </span>
        </h1>

        <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-400 md:text-xl">
          The all-in-one platform to practice interviews, analyze resumes, and 
          optimize your LinkedIn presence using advanced LLMs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/auth"
            className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
          >
            Get Started For Free 
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/pricing"
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/20"
          >
            View Pricing
          </Link>
        </div>

        {/* HCI: Affordance for Scrolling */}
        <Link
          href="#quick-navigation"
          className="mt-16 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-400"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-slate-700 p-1">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />
          </div>
          <span>Scroll to discover</span>
        </Link>
      </div>
    </section>
  );
}