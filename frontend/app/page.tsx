"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import {
  FiArrowRight,
  FiCode,
  FiCpu,
  FiCheckCircle,
  FiBriefcase,
  FiBarChart,
} from "react-icons/fi";

// ─── Shared Animation Variants ────────────────────────────────────────────────

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-[#227dff]/30 overflow-hidden">
      <Navbar />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Social Proof / Logo Cloud */}
      <section className="border-y border-white/5 bg-white/[0.02] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-6">
          <p className="text-sm font-medium text-[#7f92be] uppercase tracking-wider">
            Trusted by innovative engineering teams
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale"
          >
            {["Acme Corp", "TechFlow", "DevScale", "InnovateAI", "CloudSync"].map((company) => (
              <span key={company} className="text-xl md:text-2xl font-bold font-serif text-[#98a7cb]">
                {company}
              </span>
            ))}
          </motion.div>
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

          {/* 3. Features (Bento Box) */}
          <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-16 md:mb-24 text-center max-w-3xl mx-auto space-y-4"
            >
              <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                A complete technical hiring suite
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-[#98a7cb] leading-relaxed">
                Everything you need to source, assess, and hire top engineering talent in one unified platform.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(240px,auto)]"
            >
              <motion.div
                variants={fadeIn}
                className="md:col-span-2 group border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] rounded-3xl p-8 md:p-10 flex flex-col transition-colors hover:border-blue-400/30"
              >
                <div className="w-12 h-12 border border-white/10 bg-gradient-to-br from-blue-500/20 to-indigo-700/20 text-blue-200 rounded-xl flex items-center justify-center mb-6">
                  <FiCpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-blue-100 mb-3">AI-Powered Interviews</h3>
                <p className="text-[#aab8d8] leading-relaxed max-w-lg">
                  Conduct dynamic, conversational interviews that adapt to the candidate's skill level. Our AI evaluates not just the final answer, but the problem-solving approach and communication skills.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="group border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] rounded-3xl p-8 flex flex-col transition-colors hover:border-blue-400/30"
              >
                <div className="w-12 h-12 border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-700/20 text-cyan-200 rounded-xl flex items-center justify-center mb-6">
                  <FiCode className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-blue-100 mb-3">Real-world Coding</h3>
                <p className="text-[#aab8d8] leading-relaxed">
                  Assess candidates in a fully functional IDE environment. Support for over 20+ languages and complex project structures.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="group border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] rounded-3xl p-8 flex flex-col transition-colors hover:border-blue-400/30"
              >
                <div className="w-12 h-12 border border-white/10 bg-gradient-to-br from-purple-500/20 to-indigo-700/20 text-purple-200 rounded-xl flex items-center justify-center mb-6">
                  <FiBarChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-blue-100 mb-3">Deep Analytics</h3>
                <p className="text-[#aab8d8] leading-relaxed">
                  Get actionable insights and unbiased scoring across technical competencies, architecture design, and code quality.
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="md:col-span-2 group border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] rounded-3xl p-8 md:p-10 flex flex-col transition-colors hover:border-blue-400/30"
              >
                <div className="w-12 h-12 border border-white/10 bg-gradient-to-br from-[#227dff]/20 to-[#332989]/40 text-blue-200 rounded-xl flex items-center justify-center mb-6">
                  <FiBriefcase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-blue-100 mb-3">Seamless ATS Integration</h3>
                <p className="text-[#aab8d8] leading-relaxed max-w-lg">
                  Connect EchoHire with your existing tools. Automatically sync candidate profiles, assessment results, and interview recordings directly into your ATS workflow.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* 4. Interactive Demo Section */}
          <section id="demo" className="py-24 px-6 bg-white/[0.02] border-y border-white/5 overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-4 max-w-2xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  See EchoHire in action
                </h2>
                <p className="text-[#98a7cb] text-lg leading-relaxed">
                  A candidate experience that feels natural, backed by enterprise-grade evaluation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="rounded-2xl border border-white/10 bg-[#070d1a] overflow-hidden flex flex-col"
              >
                <div className="h-12 border-b border-white/5 bg-[#0b1730] flex items-center px-4 gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="mx-auto px-4 py-1 rounded bg-[#030712] border border-white/5 text-xs text-[#7f92be] font-mono">
                    echohire-assessment / algorithm.ts
                  </div>
                </div>

                <div className="flex flex-col md:flex-row min-h-[400px]">
                  <div className="flex-1 p-6 font-mono text-sm leading-loose border-r border-white/5 overflow-x-auto text-[#dbe7ff]">
                    {[
                      ["1", <span className="text-blue-400" key="l1">function <span className="text-yellow-200">findOptimalPath</span>(graph: Graph, start: Node): Path {"{"}</span>],
                      ["2", <span className="pl-4 text-[#7f92be]" key="l2">{"// Initialize distances"}</span>],
                      ["3", <span className="pl-4" key="l3"><span className="text-blue-400">const</span> distances = <span className="text-blue-400">new</span> <span className="text-emerald-300">Map</span>();</span>],
                      ["4", <span className="pl-4" key="l4"><span className="text-blue-400">const</span> pq = <span className="text-blue-400">new</span> <span className="text-emerald-300">PriorityQueue</span>();</span>],
                      ["5", <span key="l5">&nbsp;</span>],
                      ["6", <span className="pl-4" key="l6">pq.<span className="text-yellow-200">enqueue</span>(start, <span className="text-purple-300">0</span>);</span>],
                      ["7", <span className="pl-4" key="l7"><span className="text-blue-400">return</span> processGraph(pq, distances);</span>],
                      ["8", <span key="l8">{"}"}</span>],
                    ].map(([num, code]) => (
                      <div key={String(num)} className="flex">
                        <div className="text-[#7f92be] select-none pr-4 text-right min-w-[2rem]">{num}</div>
                        <div>{code}</div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full md:w-80 bg-[#0b1730] flex flex-col">
                    <div className="p-4 border-b border-white/5 text-sm font-medium flex items-center gap-2 text-white">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      AI Interviewer
                    </div>
                    <div className="flex-1 p-4 space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-[#dbe7ff] leading-relaxed"
                      >
                        Great start! Why did you choose a PriorityQueue over a standard array for processing the nodes?
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.5 }}
                        className="bg-[#030712] border border-white/5 rounded-xl p-3 text-sm text-[#aab8d8] leading-relaxed"
                      >
                        A PriorityQueue allows us to extract the minimum distance node in O(log V) time instead of O(V), making Dijkstra&apos;s algorithm much more efficient for sparse graphs.
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 5. Final CTA */}
          <section className="py-24 md:py-32 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] rounded-[2rem] p-10 md:p-16 text-center space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Ready to upgrade your hiring?
              </h2>
              <p className="text-lg text-[#98a7cb] max-w-xl mx-auto leading-relaxed">
                Join hundreds of engineering teams using EchoHire to identify top talent with confidence and speed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#227dff] text-white font-medium rounded-xl transition-colors hover:bg-[#1a68d4] active:bg-[#1558b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff] flex items-center justify-center gap-2"
                >
                  Get Started for Free
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 flex items-center justify-center"
                >
                  View Pricing
                </Link>
              </div>

              <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-[#7f92be]">
                {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <FiCheckCircle className="text-[#227dff] w-4 h-4" /> {t}
                  </div>
                ))}
              </div>
            </motion.div>
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
        </div>
      </section>
    </main>
        );
}