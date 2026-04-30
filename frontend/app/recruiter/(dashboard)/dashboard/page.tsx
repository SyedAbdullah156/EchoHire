"use client";

import { motion } from "framer-motion";
import { 
  FiPlus, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiArrowUpRight,
  FiMoreHorizontal,
  FiBriefcase,
  FiInfo,
  FiShield,
  FiLock
} from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";


interface DashboardStat {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}

interface DashboardCandidate {
  name: string;
  role: string;
  score: number;
  status: string;
  date: string;
}

export default function RecruiterDashboard() {
  const { name, isApproved } = useUserProfile();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<DashboardCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [jobsRes, interviewsRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/interviews")
        ]);

        if (jobsRes.ok && interviewsRes.ok) {
          const jobsData = await jobsRes.json();
          const interviewsData = await interviewsRes.json();

          const activeJobs = jobsData.data?.filter((j: { is_active: boolean }) => j.is_active).length || 0;
          const allInterviews = interviewsData.data || [];
          const totalCandidates = allInterviews.length;
          const completedInterviews = allInterviews.filter((i: { status: string }) => i.status === "completed").length;
          const hiredCount = allInterviews.filter((i: { status: string }) => i.status === "hired").length;

          setStats([
            { label: "Active Jobs", value: activeJobs.toString(), sub: "Real-time updates", icon: <FiBriefcase /> },
            { label: "Total Candidates", value: totalCandidates.toString(), sub: "Across all postings", icon: <FiTrendingUp /> },
            { label: "AI Interviews", value: completedInterviews.toString(), sub: `${completedInterviews} completed`, icon: <FiClock /> },
            { label: "Success Hires", value: hiredCount.toString(), sub: "Goal: 50", icon: <FiCheckCircle /> },
          ]);

          if (allInterviews.length > 0) {
            const mapped = allInterviews.slice(0, 5).map((int: { 
              user_id?: { name?: string }; 
              job_id?: { role?: string }; 
              score?: number; 
              status: string; 
              createdAt: string; 
            }) => ({
              name: int.user_id?.name || "Unknown",
              role: int.job_id?.role || "General",
              score: int.score || 0,
              status: int.status.charAt(0).toUpperCase() + int.status.slice(1),
              date: new Date(int.createdAt).toLocaleDateString()
            }));
            setRecentCandidates(mapped);
          }
        } else {
          setError("Failed to fetch dashboard data. Please try again later.");
        }
      } catch (error) {
        console.error("Failed to fetch recruiter dashboard data:", error);
        setError("A connection error occurred. Please check your network.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 lg:p-10 flex flex-col items-center justify-center min-h-[400px] text-primary animate-pulse">
        <FiClock size={48} className="mb-4" />
        <p className="text-xs font-black uppercase tracking-widest">Synchronizing Dashboard Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 lg:p-10 flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <FiInfo size={48} className="mb-4" />
        <p className="text-sm font-bold">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-primary text-foreground rounded-xl text-xs font-black uppercase tracking-widest"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="p-8 lg:p-10 space-y-10">
      
      {!isApproved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <FiShield size={28} />
          </div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-amber-500">Account Pending Verification</h3>
            <p className="text-sm text-amber-500/70 leading-relaxed">
              Welcome to EchoHire! To maintain the integrity of our recruiting network, your account is currently under review by our administration team. You can explore the dashboard and update your profile, but job posting and candidate management are temporarily locked.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500/50 bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/10">
            <FiInfo size={12} />
            ETA: 12-24 Hours
          </div>
        </motion.div>
      )}
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Overview</h1>
          <p className="text-sm text-text-muted">Welcome back, {name || "Recruiter"}. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link 
          href={isApproved ? "/recruiter/jobs/new" : "#"}
          className={`h-12 px-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            isApproved 
              ? "bg-primary text-foreground hover:bg-primary-hover active:scale-[0.98]" 
              : "bg-slate-800 text-text-muted cursor-not-allowed opacity-50"
          }`}
        >
          {isApproved ? <FiPlus /> : <FiLock />} {isApproved ? "Create New Job" : "Posting Locked"}
        </Link>
      </div>

      {/* --- Bento Grid Stats --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: DashboardStat, i: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-surface-1 border border-border-medium flex flex-col justify-between group hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-surface-2 border border-border-medium flex items-center justify-center text-primary transition-colors group-hover:bg-primary/10">
                {stat.icon}
              </div>
              <FiArrowUpRight className="text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-muted mb-1">{stat.label}</p>
              <h2 className="text-3xl font-black text-foreground">{stat.value}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-2">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Recent Activity Section --- */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Candidates Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Recent Candidates</h3>
            <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="bg-surface-1 border border-border-medium rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-2/50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">Candidate</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">AI Match</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {recentCandidates.map((candidate: DashboardCandidate, i: number) => (
                    <tr key={i} className="group hover:bg-surface-2/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-surface-2 border border-border-medium flex items-center justify-center font-bold text-xs text-foreground">
                            {candidate.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{candidate.name}</p>
                            <p className="text-[10px] text-text-muted">{candidate.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{candidate.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 max-w-[60px] bg-surface-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${candidate.score > 85 ? "bg-emerald-500" : "bg-primary"}`} 
                              style={{ width: `${candidate.score}%` }} 
                            />
                          </div>
                          <span className="text-xs font-black text-foreground">{candidate.score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                          candidate.status === "High Match" ? "bg-emerald-500/10 text-emerald-500" :
                          candidate.status === "Strong" ? "bg-primary/10 text-primary" : "bg-surface-2 text-text-muted"
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-surface-2 text-text-muted hover:text-foreground transition-all">
                          <FiMoreHorizontal />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-surface-1 border border-border-medium space-y-6">
            <h3 className="text-lg font-bold text-foreground">System Health</h3>
            <div className="space-y-4">
              {[
                { label: "AI Analysis Engine", status: "Operational", color: "bg-emerald-500" },
                { label: "Video Processing", status: "Operational", color: "bg-emerald-500" },
                { label: "Database Sync", status: "Optimizing", color: "bg-primary" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{item.status}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-primary relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-black text-foreground leading-tight">Elevate Your Hiring with AI Insights.</h3>
              <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                Upgrade to Enterprise for advanced predictive candidate modeling.
              </p>
              <button className="h-10 px-6 rounded-xl bg-white text-primary text-[10px] font-black uppercase tracking-widest transition-transform group-hover:scale-105 active:scale-95">
                Learn More
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-surface-2 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

      </div>

    </div>
  );
}
