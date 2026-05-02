"use client";

import { motion } from "framer-motion";
import { 
  FiPlus, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiArrowUpRight,
  FiMoreHorizontal,
  FiBriefcase
} from "react-icons/fi";
import Link from "next/link";

const STATS = [
  { label: "Active Jobs", value: "12", sub: "+2 this week", icon: <FiBriefcase /> },
  { label: "Total Candidates", value: "842", sub: "+12.5% increase", icon: <FiTrendingUp /> },
  { label: "AI Interviews", value: "156", sub: "24 pending review", icon: <FiClock /> },
  { label: "Success Hires", value: "38", sub: "Across 8 teams", icon: <FiCheckCircle /> },
];

const RECENT_CANDIDATES = [
  { name: "Alex Rivera", role: "Sr. Frontend Engineer", score: 94, status: "High Match", date: "2h ago" },
  { name: "Sarah Chen", role: "Product Designer", score: 88, status: "Strong", date: "5h ago" },
  { name: "Marcus Thorne", role: "Backend Developer", score: 72, status: "Under Review", date: "1d ago" },
  { name: "Elena Volkov", role: "DevOps Engineer", score: 91, status: "High Match", date: "1d ago" },
  { name: "Julian Pierce", role: "QA Engineer", score: 64, status: "Screened", date: "2d ago" },
];

export default function RecruiterDashboard() {
  return (
    <div className="p-8 lg:p-10 space-y-10">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Overview</h1>
          <p className="text-sm text-text-muted">Welcome back, Jane. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link 
          href="/recruiter/jobs/new"
          className="h-12 px-6 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          <FiPlus /> Create New Job
        </Link>
      </div>

      {/* --- Bento Grid Stats --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
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
              <h2 className="text-3xl font-black text-white">{stat.value}</h2>
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
            <h3 className="text-xl font-bold text-white">Recent Candidates</h3>
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
                  {RECENT_CANDIDATES.map((candidate, i) => (
                    <tr key={i} className="group hover:bg-surface-2/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-surface-2 border border-border-medium flex items-center justify-center font-bold text-xs text-white">
                            {candidate.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{candidate.name}</p>
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
                          <span className="text-xs font-black text-white">{candidate.score}%</span>
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
                        <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-surface-2 text-text-muted hover:text-white transition-all">
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
            <h3 className="text-lg font-bold text-white">System Health</h3>
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
              <h3 className="text-lg font-black text-white leading-tight">Elevate Your Hiring with AI Insights.</h3>
              <p className="text-sm font-medium text-white/80 leading-relaxed">
                Upgrade to Enterprise for advanced predictive candidate modeling.
              </p>
              <button className="h-10 px-6 rounded-xl bg-white text-primary text-[10px] font-black uppercase tracking-widest transition-transform group-hover:scale-105 active:scale-95">
                Learn More
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

      </div>

    </div>
  );
}
