import { motion, Variants } from "framer-motion";
import { Cpu, Code, BarChart } from "lucide-react";

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
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Cpu className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">Conversational AI Interviews</h3>
            <p className="max-w-xl text-[#98a7cb] leading-relaxed">
              {"Move beyond rigid multiple-choice tests. Our AI conducts dynamic interviews that adapt in real-time to the candidate's skill level, evaluating not just the final answer, but their problem-solving approach."}
            </p>
          </div>
          <div className="mt-8 h-2 w-full rounded-full bg-[#0d162a] overflow-hidden">
             <div className="h-full w-2/3 rounded-full bg-blue-500/50" />
          </div>
        </motion.div>

        {/* Small Card 1 */}
        <motion.div
          variants={bentoVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1a] hover:bg-[#0d162a] p-8"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Code className="h-7 w-7" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-white">Real-world Coding</h3>
          <p className="text-[#98a7cb] leading-relaxed">
            Assess candidates in a fully functional IDE environment supporting over 20+ languages and complex architectural structures.
          </p>
        </motion.div>

        {/* Small Card 2 */}
        <motion.div
          variants={bentoVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1a] hover:bg-[#0d162a] p-8"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
            <BarChart className="h-7 w-7" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-white">Deep Analytics</h3>
          <p className="text-[#98a7cb] leading-relaxed">
            Get actionable insights and unbiased scoring across technical competencies, design patterns, and code quality.
          </p>
        </motion.div>

        {/* Span-2 Card at the bottom */}
        <motion.div
          variants={bentoVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d1a] hover:bg-[#0d162a] p-8 md:col-span-2 md:p-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-white">Seamless ATS Integration</h3>
              <p className="text-[#98a7cb] leading-relaxed max-w-lg">
                Connect EchoHire with your existing tools. Automatically sync candidate profiles, assessment results, and interview recordings.
              </p>
            </div>
            <div className="hidden md:flex gap-4 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">ATS</div>
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">CRM</div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
