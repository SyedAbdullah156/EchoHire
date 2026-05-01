"use client";

import { Suspense, useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ActionAlert from "../../components/dashboard/ActionAlert";
import ProgressAreaChart from "../../components/dashboard/ProgressAreaChart";
import QuickActionsFab from "../../components/dashboard/QuickActionsFab";
import StatCard from "../../components/dashboard/StatCard";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiAward, FiBarChart2, FiFileText, FiRefreshCw, FiHome, FiZap, FiTrendingUp } from "react-icons/fi";
import { toast } from "sonner";

const skillData = [
  { label: "Coding", value: 90, color: "from-blue-400 to-blue-600" },
  { label: "Design", value: 72, color: "from-purple-400 to-purple-600" },
  { label: "Behavioral", value: 58, color: "from-emerald-400 to-emerald-600" },
  { label: "Technical", value: 66, color: "from-amber-400 to-amber-600" },
];

/** 
 * HCI ANIMATION STRATEGY:
 * We use a staggered entrance to guide the user's eye from the 
 * Welcome Message (Top) to the Action Cards (Middle) to the Progress (Bottom).
 */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const shouldCompleteProfile = searchParams.get("completeProfile") === "1";
  const [dataError, setDataError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate initial data fetch
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsLoading(false);
      } catch {
        setDataError(true);
        toast.error("Critical: Failed to sync dashboard data.");
      }
    };
    loadData();
  }, []);

  if (dataError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050b18] p-6 text-white">
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <FiRefreshCw size={40} className="animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold">Connection Interrupted</h2>
          <p className="text-[#93a5cc]">We couldn't reach the AI Engine. Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold transition-all hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            Reconnect Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050b18] text-[#e2e8f0] selection:bg-blue-500/30 antialiased">
      <section className="mx-auto flex max-w-[1580px] flex-col gap-6 px-4 pb-12 pt-8 lg:flex-row md:px-8">

        {/* Persistent Navigation */}
        <DashboardSidebar active="dashboard" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-6"
        >
          {/* Top Status Bar - HCI: Visibility of System Status */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4a5d89]">
              <FiHome className="text-blue-500" />
              <span>Control Center</span>
              <span className="mx-1 text-[#243253]">/</span>
              <span className="text-[#93a5cc]">Insights Overview</span>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-[#0d162a] border border-[#243253] px-4 py-1.5 text-[10px] font-bold">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 tracking-widest uppercase">AI Engine: Online</span>
            </div>
          </motion.div>

          {/* Conditional Alert - HCI: User Control & Freedom */}
          <AnimatePresence>
            {shouldCompleteProfile && (
              <motion.div
                variants={itemVariants}
                exit={{ opacity: 0, y: -20 }}
                className="relative overflow-hidden rounded-[2rem] border border-blue-500/30 bg-blue-600/5 p-6 backdrop-blur-xl"
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FiZap className="text-yellow-400" /> Optimize Your Experience
                    </h3>
                    <p className="text-sm text-[#9fb1d8] max-w-xl">
                      Your profile data is used to calibrate interview difficulty for the <span className="text-white font-medium">Class of 2027</span> benchmarks.
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="whitespace-nowrap rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all active:scale-95"
                  >
                    Complete Profile
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Section */}
          <motion.header variants={itemVariants} className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Welcome, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Uzair Ahmad</span>
            </h1>
            <p className="text-[#9fb1d8] text-lg">
              System analysis complete. You have <span className="text-white font-semibold">3 pending tasks</span> for today.
            </p>
          </motion.header>

          {/* StatCards Grid - HCI: Recognition rather than Recall */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Priority Interview"
              value="Google Senior SE"
              subtitle="Scheduled: Sept 5th, 2:00 PM"
              ctaLabel="Resume Simulation"
              ctaHref="/ai-interview"
              icon={FiAward}
              className="border-blue-500/20 bg-gradient-to-br from-[#0d162a] to-[#0a1223]"
            />
            <StatCard
              title="LinkedIn Visibility"
              value="82 / 100"
              subtitle="Global Ranking: Top 15%"
              ctaLabel="Enhance Profile"
              ctaHref="/linkedin-optimizer"
              icon={FiBarChart2}
            />
            <StatCard
              title="Resume Integrity"
              value="92 / 100"
              subtitle="Status: ATS Optimized"
              ctaLabel="Analyze PDF"
              ctaHref="/resume-analyzer"
              icon={FiFileText}
            />
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
            {/* Chart - HCI: Aesthetic and Minimalist Design */}
            <motion.section
              variants={itemVariants}
              className="rounded-[2.5rem] border border-[#243253] bg-[#0d162a]/80 p-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FiTrendingUp className="text-blue-400" /> Growth Velocity
                  </h2>
                  <p className="text-sm text-[#9fb1d8]">Aggregate score improvement over time</p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-lg bg-[#050b18] px-3 py-1 text-[10px] font-bold text-blue-400 border border-[#243253]">MONTHLY</span>
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ProgressAreaChart />
              </div>
            </motion.section>

            {/* Side Panel */}
            <div className="space-y-6">
              <motion.section
                variants={itemVariants}
                className="rounded-[2.5rem] border border-[#243253] bg-[#0d162a]/80 p-8 backdrop-blur-md"
              >
                <h2 className="text-xl font-bold text-white mb-6">Skill Mastery</h2>
                <div className="space-y-6">
                  {skillData.map((skill) => (
                    <div key={skill.label} className="group">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-[#cfd9f3] group-hover:text-white transition-colors">{skill.label}</p>
                        <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{skill.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#1a2a46] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Action Alerts - HCI: Help Users Recognize, Diagnose, and Recover */}
              <motion.div variants={itemVariants}>
                <ActionAlert
                  title="Daily Sprint"
                  items={[
                    "Optimize Profile: Add FAST'27 Experience",
                    "Code: Implement LRU Cache",
                    "ATS: Upload fresh PDF version",
                  ]}
                />
              </motion.div>
            </div>
          </div>

          {/* User Presence & Floating Actions */}
          <QuickActionsFab streak={8} />
        </motion.div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
