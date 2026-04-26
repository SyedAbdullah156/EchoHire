"use client";

import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ActionAlert from "../../components/dashboard/ActionAlert";
import ProgressAreaChart from "../../components/dashboard/ProgressAreaChart";
import QuickActionsFab from "../../components/dashboard/QuickActionsFab";
import StatCard from "../../components/dashboard/StatCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiAward, FiBarChart2, FiFileText } from "react-icons/fi";

const skillData = [
  { label: "Coding", value: 90 },
  { label: "Design", value: 72 },
  { label: "Behavioral", value: 58 },
  { label: "Technical", value: 66 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const shouldCompleteProfile = searchParams.get("completeProfile") === "1";

  return (
    <main className="min-h-screen bg-[#050b18] text-white [font-family:Inter,Manrope,ui-sans-serif,system-ui,sans-serif]">
      <Navbar />
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-8 pt-24 lg:flex-row">
        <DashboardSidebar active="dashboard" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45 }}
          className="flex-1 space-y-4 rounded-md"
        >
          {shouldCompleteProfile && (
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[#dbe7ff] shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-xl"
            >
              <p className="text-sm md:text-base">
                Welcome! Please complete your profile so EchoHire can personalize interview and career recommendations.
              </p>
              <Link
                href="/profile"
                className="mt-3 inline-flex rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
              >
                Complete Profile
              </Link>
            </motion.div>
          )}

          <motion.header
            variants={itemVariants}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(10,39,105,0.2)] backdrop-blur-xl"
          >
            <h1 className="text-2xl font-semibold text-[#dbe7ff] md:text-4xl">
              Welcome Back, Uzair Ahmad
            </h1>
            <p className="text-sm text-[#bfcbeb] md:text-lg">
              Explore your Interviews and keep progressing today
            </p>
          </motion.header>

          <motion.div variants={itemVariants} transition={{ duration: 0.45 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Recent Interview"
              value="Google Senior Software Engineer"
              subtitle="Date: Sep 5th | Time: 2PM"
              ctaLabel="Continue Interview"
              ctaHref="/ai-interview"
              icon={FiAward}
            />
            <StatCard
              title="LinkedIn Visibility"
              value="82 / 100"
              ctaLabel="Optimize Profile"
              ctaHref="/linkedin-optimizer"
              icon={FiBarChart2}
            />
            <StatCard
              title="Resume Score"
              value="92 / 100"
              ctaLabel="Analyze Resume"
              ctaHref="/resume-analyzer"
              icon={FiFileText}
            />
          </motion.div>

          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)] backdrop-blur-xl"
            >
              <p className="text-2xl font-semibold text-[#e6eeff] md:text-3xl">Interview Progress</p>
              <p className="mb-4 text-sm text-[#becbeb] md:text-base">
                Track all ongoing and completed interviews
              </p>
              <ProgressAreaChart />
            </motion.div>

            <div className="space-y-4">
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)] backdrop-blur-xl"
              >
                <p className="text-2xl font-semibold text-[#e6eeff] md:text-3xl">Skill Mastery</p>
                <p className="mb-4 text-sm text-[#becbeb] md:text-base">Track your progress and skills</p>
                {skillData.map((skill) => (
                  <div key={skill.label} className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-sm md:text-base">
                      <p className="text-[#cfd9f3]">{skill.label}</p>
                      <span className="text-[#c3d6ff]">{skill.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#1a2a46]">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-[#4ea1ff] to-[#7f88ff]"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} transition={{ duration: 0.45 }}>
                <ActionAlert
                  title="Daily Challenges"
                  items={[
                    "Coding Challenge: Implement a Hash Map",
                    "Resume Improvement: Add another project section",
                    "Coding Challenge: Implement a URL Shortener",
                  ]}
                />
              </motion.div>
            </div>
          </div>

          <QuickActionsFab streak={8} />
        </motion.div>
      </section>
    </main>
  );
}
