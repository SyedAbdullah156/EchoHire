"use client";

import { Suspense, useState, useEffect } from "react";
import ActionAlert from "@/components/dashboard/ActionAlert";
import ProgressAreaChart from "@/components/dashboard/ProgressAreaChart";
import QuickActionsFab from "@/components/dashboard/QuickActionsFab";
import StatCard from "@/components/dashboard/StatCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiAward, FiBarChart2, FiFileText, FiRefreshCw, FiHome, FiZap, FiTrendingUp } from "react-icons/fi";
import JobNotifications from "@/components/dashboard/notifications/JobNotifications";
import { toast } from "sonner";

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

interface Interview {
  _id: string;
  status: string;
  score?: number;
  job_id?: { name: string; role: string };
  rounds: Array<{
    status: string;
    type: string;
    problemStatement?: string;
    testCases?: Array<{ input: string; expected: string }>;
  }>;
  join_code?: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const shouldCompleteProfile = searchParams.get("completeProfile") === "1";
  const [dataError, setDataError] = useState(false);
  const [planName, setPlanName] = useState("Free");
  const { name, createdAt, user } = useUserProfile();
  const displayName = name || "Candidate";
  
  const [priorityInterview, setPriorityInterview] = useState<Interview | null>(null);
  const [performanceData, setPerformanceData] = useState<{ week: string; score: number }[]>([]);

  // Calculate trial info safely
  const [trialInfo, setTrialInfo] = useState({ daysLeft: 14, expired: false });

  // Dynamic Skill Data
  const dynamicSkillData = user?.profile?.skills || [
    { label: "Coding", value: 90, color: "from-blue-400 to-blue-600" },
    { label: "Design", value: 72, color: "from-purple-400 to-purple-600" },
    { label: "Behavioral", value: 58, color: "from-emerald-400 to-emerald-600" },
    { label: "Technical", value: 66, color: "from-amber-400 to-amber-600" },
  ];

  // Dynamic Metrics
  const linkedinScore = user?.profile?.linkedinScore || 82;
  const resumeScore = user?.profile?.resumeScore || 92;

  useEffect(() => {
    if (createdAt) {
      const trialDurationDays = 14;
      const trialStart = new Date(createdAt);
      const trialEnd = new Date(trialStart.getTime() + trialDurationDays * 24 * 60 * 60 * 1000);
      const msLeft = trialEnd.getTime() - Date.now();
      const days = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
      Promise.resolve().then(() => setTrialInfo({ daysLeft: days, expired: days <= 0 }));
    }
  }, [createdAt]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/interviews/my");
        if (res.ok) {
          const result = await res.json();
          const interviews = result.data || [];
          if (interviews.length > 0) {
            setPriorityInterview(interviews[0]);
            
            // Map scores for the chart
            const chartData = interviews
              .slice()
              .reverse() // Oldest first
              .map((int: Interview, idx: number) => ({
                week: `I${idx + 1}`,
                score: int.score || 0
              }))
              .filter((d: { score: number }) => d.score > 0);
            
            setPerformanceData(chartData);
          }
        }
      } catch {
        setDataError(true);
        toast.error("Critical: Failed to sync dashboard data.");
      }
    };
    
    Promise.resolve().then(() => loadData());
  }, []);

  useEffect(() => {
    const savedPlan = localStorage.getItem("echohire-plan");
    if (savedPlan) {
      Promise.resolve().then(() => setPlanName(savedPlan));
    }
  }, []);

  if (dataError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <FiRefreshCw size={40} className="animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold">Connection Interrupted</h2>
          <p className="text-text-secondary">{"We couldn't reach the AI Engine. Please check your connection and try again."}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl bg-primary py-3 font-bold transition-all hover:bg-primary active:scale-95 shadow-lg shadow-blue-600/20"
          >
            Reconnect Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
          {/* Top Status Bar - HCI: Visibility of System Status */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
              <FiHome className="text-primary" />
              <span>Control Center</span>
              <span className="mx-1 text-border-medium">/</span>
              <span className="text-text-secondary">Insights Overview</span>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-surface-2 border border-border-subtle px-4 py-1.5 text-[10px] font-bold">
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
                className="relative overflow-hidden rounded-[2rem] border border-blue-500/30 bg-primary/5 p-6 backdrop-blur-xl"
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <FiZap className="text-yellow-400" /> Optimize Your Experience
                    </h3>
                    <p className="text-sm text-text-secondary max-w-xl">
                      Your profile data is used to calibrate interview difficulty for the <span className="text-foreground font-medium">Class of 2027</span> benchmarks.
                    </p>
                  </div>
                  <Link
                    href="/candidate/profile"
                    className="whitespace-nowrap rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-foreground shadow-lg shadow-blue-600/25 hover:bg-primary transition-all active:scale-95"
                  >
                    Complete Profile
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Section */}
          <motion.header variants={itemVariants} className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Welcome, <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{displayName}</span>
            </h1>
            <p className="text-text-secondary text-lg">
              System analysis complete. You have <span className="text-foreground font-semibold">3 pending tasks</span> for today.
            </p>
            <div className="inline-flex flex-wrap items-center gap-3 rounded-2xl border border-border-subtle bg-surface-2/80 px-4 py-3 text-sm">
              <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                Plan: {planName}
              </span>
              {planName.toLowerCase() === "free" ? (
                <span className={`font-semibold ${trialInfo.expired ? "text-red-300" : "text-emerald-300"}`}>
                  {trialInfo.expired
                    ? "Free trial ended"
                    : `${trialInfo.daysLeft} day${trialInfo.daysLeft === 1 ? "" : "s"} left in free trial`}
                </span>
              ) : (
                <span className="font-semibold text-emerald-300">Your premium plan is active</span>
              )}
            </div>
          </motion.header>

          {/* StatCards Grid - HCI: Recognition rather than Recall */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title={priorityInterview ? "Active Application" : "No Active Interviews"}
              value={priorityInterview?.job_id?.role || "Ready for Simulation"}
              subtitle={priorityInterview ? `Status: ${priorityInterview.status}` : "Practice your skills today"}
              badge={priorityInterview?.join_code}
              ctaLabel={priorityInterview ? "Resume Simulation" : "Practice Now"}
              ctaHref={
                priorityInterview 
                  ? `/candidate/ai-interview?id=${priorityInterview._id}&round=${
                      priorityInterview.rounds?.findIndex((r: { status: string }) => r.status !== "completed") ?? 0
                    }` 
                  : "/candidate/ai-interview"
              }
              icon={FiAward}
              className="border-primary/20 bg-card-bg"
            />
            <StatCard
              title="LinkedIn Visibility"
              value={`${linkedinScore} / 100`}
              subtitle={linkedinScore > 80 ? "Global Ranking: Top 15%" : "Optimization Recommended"}
              ctaLabel="Enhance Profile"
              ctaHref="/candidate/linkedin-optimizer"
              icon={FiBarChart2}
            />
            <StatCard
              title="Resume Integrity"
              value={`${resumeScore} / 100`}
              subtitle={resumeScore > 85 ? "Status: ATS Optimized" : "Needs Review"}
              ctaLabel="Analyze PDF"
              ctaHref="/candidate/resume-analyzer"
              icon={FiFileText}
            />
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              {/* Chart - HCI: Aesthetic and Minimalist Design */}
              <motion.section
                variants={itemVariants}
                className="rounded-[2.5rem] border border-border-subtle bg-surface-2/80 p-6 backdrop-blur-md shadow-xl self-start"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <FiTrendingUp className="text-primary" /> Growth Velocity
                    </h2>
                    <p className="text-sm text-text-secondary">Aggregate score improvement over time</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-lg bg-background px-3 py-1 text-[10px] font-bold text-primary border border-border-subtle">MONTHLY</span>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressAreaChart data={performanceData} />
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

            {/* Side Panel */}
            <div className="space-y-6">
              <motion.section
                variants={itemVariants}
                className="rounded-[2.5rem] border border-border-subtle bg-surface-2/80 p-8 backdrop-blur-md"
              >
                <h2 className="text-xl font-bold text-foreground mb-6">Skill Mastery</h2>
                <div className="space-y-6">
                  {dynamicSkillData.map((skill: { label: string; value: number; color: string }) => (
                    <div key={skill.label} className="group">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors">{skill.label}</p>
                        <span className="text-xs font-bold text-primary bg-blue-400/10 px-2 py-0.5 rounded">{skill.value}%</span>
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

              {/* Job Alerts - New Notification System */}
              <motion.div variants={itemVariants}>
                <JobNotifications />
              </motion.div>
            </div>
          </div>

          {/* User Presence & Floating Actions */}
          <QuickActionsFab />
        </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
