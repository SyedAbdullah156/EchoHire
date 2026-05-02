import { motion, Variants } from "framer-motion";
import { Cpu, Code, BarChart, Link2, ArrowRight } from "lucide-react";
import Link from "next/link";

const bentoVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function FeaturesBento() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="mb-16 md:mb-24 space-y-4 text-center"
      >
        <motion.h2 variants={bentoVariants} className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          A complete technical hiring suite
        </motion.h2>
        <motion.p variants={bentoVariants} className="mx-auto max-w-2xl text-lg leading-relaxed text-[#98a7cb]">
          Everything you need to source, assess, and hire top engineering talent in one unified platform.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-1 gap-6 md:grid-cols-3 auto-rows-[minmax(300px,auto)]"
      >
        {/* Large Span-2 Card */}
        <motion.div
          variants={bentoVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1a] hover:bg-[#0d162a] p-8 md:col-span-2 md:p-10"
        >
          <div>
            <div className="flex items-center gap-5 mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Cpu className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">Conversational AI Interviews</h3>
            </div>
            <p className="max-w-xl text-lg text-[#98a7cb] leading-relaxed font-medium">
              {"Move beyond rigid multiple-choice tests. Our AI conducts dynamic interviews that adapt in real-time to the candidate's skill level, evaluating not just the final answer, but their problem-solving approach."}
            </p>
          </div>
          <div className="mt-8">
            <Link href="/features#ai-interviewing" className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
              Explore Feature
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Small Card 1 */}
        <motion.div
          variants={bentoVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1a] hover:bg-[#0d162a] p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Code className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Real-world Coding</h3>
          </div>
          <p className="text-lg text-[#98a7cb] mb-8 leading-relaxed font-medium">
            Assess candidates in a fully functional IDE environment supporting over 20+ languages and complex architectural structures.
          </p>
          <div className="mt-auto">
            <Link href="/features#code-execution" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Explore Feature
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Small Card 2 */}
        <motion.div
          variants={bentoVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1a] hover:bg-[#0d162a] p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <BarChart className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Deep Analytics</h3>
          </div>
          <p className="text-lg text-[#98a7cb] mb-8 leading-relaxed font-medium">
            Get actionable insights and unbiased scoring across technical competencies, design patterns, and code quality.
          </p>
          <div className="mt-auto">
            <Link href="/features#analytics" className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              Explore Feature
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Span-2 Card at the bottom */}
        <motion.div
          variants={bentoVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1a] hover:bg-[#0d162a] p-8 md:col-span-2 md:p-10"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                <Link2 className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">Seamless ATS Integration</h3>
            </div>
            <p className="text-lg text-[#98a7cb] leading-relaxed max-w-lg font-medium">
              Connect EchoHire with your existing tools. Automatically sync candidate profiles, assessment results, and interview recordings.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/features#analytics" className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
              Explore Feature
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
