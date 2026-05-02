"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants, MotionValue } from "framer-motion";
import { Brain, Code, LineChart, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  visual: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "AI-Native Interviewing",
    description: "Move beyond rigid coding tests. Our AI conducts dynamic, conversational interviews that probe for depth of knowledge, architectural thinking, and communication skills&mdash;just like a senior engineer would.",
    icon: <Brain className="w-8 h-8" />,
    color: "bg-primary/10 text-primary border-primary/20",
    visual: (
      <div className="w-full h-full p-10 font-mono text-sm space-y-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 font-bold">AI</div>
          <div className="bg-surface-2 border border-border-medium p-5 rounded-3xl rounded-tl-none shadow-xl">
            <p className="text-white leading-relaxed">
              {"\"That's an interesting approach to the caching layer. Why did you choose a **Redlock** implementation over a simple TTL for this specific distributed scenario?\""}
            </p>
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <div className="bg-primary/10 border border-primary/20 p-5 rounded-3xl rounded-tr-none text-white max-w-[85%]">
            <p className="leading-relaxed">
              {"\"Since we're dealing with critical transaction data across multiple nodes, Redlock ensures mutual exclusion that a standard TTL-based cache wouldn't guarantee during split-brain scenarios.\""}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-2 border border-border-medium flex items-center justify-center shrink-0 font-bold text-text-muted">JD</div>
        </div>
      </div>
    ),
  },
  {
    title: "Real-time Code Execution",
    description: "Candidates solve problems in a fully-functional, secure IDE. Support for 20+ languages, multi-file projects, and instant feedback loops with integrated test runners.",
    icon: <Code className="w-8 h-8" />,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    visual: (
      <div className="w-full h-full bg-surface-2 overflow-hidden flex flex-col">
        <div className="h-10 border-b border-border-subtle bg-white/5 flex items-center px-6 gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-green-500/40" />
          </div>
          <span className="text-xs text-text-muted font-mono tracking-wider">distributed_system.py</span>
        </div>
        <div className="flex-1 p-8 font-mono text-sm leading-relaxed">
          <pre className="text-emerald-400/90">
            <code>{`class LoadBalancer:
    def __init__(self, strategy="round_robin"):
        self.nodes = []
        self.current = 0
        self.strategy = strategy

    def get_next_node(self):
        if not self.nodes:
            return None
        # Implement dynamic weighting...`}</code>
          </pre>
          <div className="mt-8 pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Running tests...
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              &check; Test load_balancing_logic passed (0.4s)
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Unbiased Scoring Analytics",
    description: "Eliminate hiring bias with structured data. Get deep insights into code quality, architecture patterns, and problem-solving speed, all normalized across your entire candidate pool.",
    icon: <LineChart className="w-8 h-8" />,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    visual: (
      <div className="w-full h-full p-10 flex flex-col gap-10">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="block text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1">Overall Competency</span>
              <span className="text-3xl font-black text-white">Top 2%</span>
            </div>
            <div className="text-right">
              <span className="text-primary font-bold">98/100</span>
            </div>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "98%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { label: "Code Quality", value: "84%", color: "text-emerald-400" },
            { label: "Architecture", value: "92%", color: "text-blue-400" },
            { label: "Efficiency", value: "89%", color: "text-purple-400" },
            { label: "Communication", value: "95%", color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-3xl bg-surface-1/50 border border-border-medium">
              <span className="block text-[10px] text-text-muted uppercase tracking-widest mb-2">{stat.label}</span>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-48 pb-32 px-6 border-b border-border-subtle overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,125,255,0.1)_0%,transparent_50%)]" />
        <div className="max-w-7xl mx-auto text-center space-y-10 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
          >
            <Zap size={14} className="fill-current" />
            Core Capabilities
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            Built for <span className="text-primary">Precision</span> Hiring.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed font-medium"
          >
            A technical assessment platform that understands code and engineers. No more basic quizzes, just pure technical depth.
          </motion.p>
        </div>
      </section>

      {/* Sticky Scroll Section */}
      <section ref={containerRef} className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">

          {/* Left Column: Text Content */}
          <div className="space-y-64 py-32">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                id={i === 0 ? "ai-interviewing" : i === 1 ? "code-execution" : "analytics"}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20%" }}
                className="min-h-[60vh] flex flex-col justify-center space-y-8 scroll-mt-32"
              >
                <div className={`w-20 h-20 rounded-[2rem] border-2 flex items-center justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <h2 className="text-5xl font-black tracking-tight">{feature.title}</h2>
                <p className="text-2xl text-text-secondary leading-relaxed font-medium">
                  {feature.description}
                </p>
                <div className="flex gap-6 pt-6">
                  <button className="group px-8 py-4 rounded-2xl bg-white/5 border border-border-medium font-bold text-white hover:bg-white/10 transition-all flex items-center gap-3">
                    Deep Dive
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Sticky Visuals */}
          <div className="hidden lg:block relative">
            <div className="sticky top-40 h-[600px] w-full rounded-[3rem] border border-border-medium bg-surface-1 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,125,255,0.05)_0%,transparent_50%)]" />
              <StickyVisuals features={features} containerRef={containerRef} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-surface-1/30 border-y border-border-subtle py-40 px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-20">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Enterprise Infrastructure</h2>
            <p className="text-xl text-text-muted">Built for the most demanding engineering teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />, title: "SOC2 Type II", desc: "Highest industry security standards and regular audits." },
              { icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />, title: "GDPR Compliant", desc: "Strict data privacy and sovereignty for global teams." },
              { icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />, title: "Cheat-Proof Engine", desc: "AI-powered plagiarism and multi-browser detection." },
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-surface-1 border border-border-subtle space-y-6 transition-transform hover:-translate-y-2">
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function StickyVisuals({ features, containerRef }: { features: Feature[], containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="relative w-full h-full">
      {features.map((feature, i) => {
        const ranges: [number, number][] = [[0, 0.3], [0.3, 0.5], [0.5, 1.0]];
        const range = ranges[i];

        return (
          <VisualCard
            key={i}
            visual={feature.visual}
            progress={scrollYProgress}
            range={range}
          />
        );
      })}
    </div>
  );
}

function VisualCard({ visual, progress, range }: { visual: React.ReactNode, progress: MotionValue<number>, range: [number, number] }) {
  // Calculate local offsets for smooth fade-in/out within the card's active range
  const buffer = (range[1] - range[0]) * 0.15;
  const input = [range[0], range[0] + buffer, range[1] - buffer, range[1]];

  const opacity = useTransform(progress, input, [0, 1, 1, 0]);
  const scale = useTransform(progress, input, [0.95, 1, 1, 0.95]);
  const y = useTransform(progress, input, [20, 0, 0, -20]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="absolute inset-0 flex items-center justify-center p-6"
    >
      <div className="w-full h-full rounded-[2rem] bg-background border border-border-medium overflow-hidden">
        {visual}
      </div>
    </motion.div>
  );
}
