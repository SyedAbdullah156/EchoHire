// components/Hero.tsx
import Link from "next/link";
import { FiArrowRight, FiMousePointer } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center bg-[url('/mainpagepic.png')] bg-cover bg-center px-6 md:px-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.74)_20%,rgba(3,7,18,0.48)_60%,rgba(3,7,18,0.4)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[#0a1226]/35 backdrop-brightness-75" />

      <div className="relative z-10 max-w-2xl rounded-2xl border border-white/15 bg-[#081228]/45 p-6 backdrop-blur-[2px] md:p-8">
        <h1 className="mb-5 text-4xl font-bold leading-tight text-white md:text-6xl">
          Master Your Tech Career with AI
        </h1>

        <p className="mb-8 max-w-xl text-base leading-relaxed text-[#c6d1ea] md:text-lg">
          Practice real interviews, improve your resume, and optimize your profile in one clean workflow.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/auth"
            prefetch
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)]"
          >
            Get Started For Free <FiArrowRight />
          </Link>

          <Link
            href="/pricing"
            prefetch
            className="rounded-lg border border-blue-400/70 px-6 py-3 text-white transition hover:bg-blue-500/10"
          >
            View Pricing
          </Link>
        </div>

        <Link
          href="#quick-navigation"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-[#d7e3ff] transition hover:border-blue-300/60 hover:text-white"
        >
          <FiMousePointer className="animate-bounce" />
          Scroll to explore
        </Link>
      </div>
    </section>
  );
}