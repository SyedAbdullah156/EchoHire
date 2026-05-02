"use client";

import { motion } from "framer-motion";
import { FiUsers, FiTarget, FiShield, FiCpu } from "react-icons/fi";
import Navbar from "@/components/Navbar";

const VALUES = [
  {
    icon: <FiCpu className="text-primary" />,
    title: "AI with Purpose",
    description: "We don't just use AI because it's trendy. we build intelligent tools that solve real career roadblocks."
  },
  {
    icon: <FiTarget className="text-primary" />,
    title: "Candidate First",
    description: "Our platform is designed to give power back to the candidates in a world of automated HR filters."
  },
  {
    icon: <FiShield className="text-primary" />,
    title: "Privacy First",
    description: "Your career data is sensitive. We encrypt everything and never sell your profile to third parties."
  },
  {
    icon: <FiUsers className="text-primary" />,
    title: "Human Touch",
    description: "We believe AI should augment human potential, not replace it. Our feedback is designed to make YOU better."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              Our Mission
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              Leveling the <span className="text-primary text-glow">Playing Field</span> for Every Candidate.
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              EchoHire was founded by engineers and recruiters who realized that the hiring process was broken. We built the tools we wished we had.
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="bg-surface-1 border-y border-border-medium py-20 mb-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
            {[
              { label: "Candidates Assisted", value: "150K+" },
              { label: "Interviews Optimized", value: "2M+" },
              { label: "Success Rate", value: "84%" },
              { label: "AI Models", value: "12" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#227dff_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>
        </section>

        {/* Values Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-surface-1 border border-border-medium hover:border-primary/30 transition-all group"
              >
                <div className="h-12 w-12 rounded-2xl bg-surface-2 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-8">The Story</h2>
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
            <p>
              {"It started in a small apartment with a simple realization: recruitment algorithms were filtering out brilliant people just because they didn't know how to \"speak\" to the AI."}
            </p>
            <p>
              We decided to build an AI that could teach candidates how to pass the robots and shine during the human interview. Today, EchoHire is used by tens of thousands of professionals worldwide to land their dream roles.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
