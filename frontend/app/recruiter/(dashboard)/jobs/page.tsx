"use client";

import { motion } from "framer-motion";
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiMoreHorizontal, 
  FiBriefcase,
  FiMapPin,
  FiUsers,
  FiClock
} from "react-icons/fi";
import Link from "next/link";

const JOBS = [
  { 
    id: "JOB-101", 
    title: "Senior Frontend Engineer", 
    dept: "Engineering", 
    location: "SF / Hybrid", 
    candidates: 24, 
    interviews: 8, 
    status: "Active",
    posted: "3 days ago"
  },
  { 
    id: "JOB-102", 
    title: "Product Designer", 
    dept: "Design", 
    location: "Remote", 
    candidates: 156, 
    interviews: 12, 
    status: "Active",
    posted: "5 days ago"
  },
  { 
    id: "JOB-103", 
    title: "Backend Developer", 
    dept: "Engineering", 
    location: "NY / On-site", 
    candidates: 89, 
    interviews: 4, 
    status: "Draft",
    posted: "1 week ago"
  },
];

export default function JobsPage() {
  return (
    <div className="p-8 lg:p-12 space-y-10">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Job Postings</h1>
          <p className="text-sm text-text-muted">Manage your active listings and AI interview configurations.</p>
        </div>
        <Link 
          href="/recruiter/jobs/new"
          className="h-12 px-6 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          <FiPlus /> Post New Job
        </Link>
      </div>

      {/* --- Search & Filter Bar --- */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by job title or department..."
            className="w-full h-12 bg-surface-1 border border-border-medium rounded-2xl pl-12 pr-4 text-sm text-white outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button className="h-12 px-6 flex items-center gap-2 rounded-2xl bg-surface-1 border border-border-medium text-xs font-bold text-text-muted hover:text-white transition-all">
          <FiFilter /> Filters
        </button>
      </div>

      {/* --- Jobs Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {JOBS.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-surface-1 border border-border-medium flex flex-col group hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-2xl bg-surface-2 border border-border-medium flex items-center justify-center text-primary">
                <FiBriefcase size={20} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                job.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-surface-2 text-text-muted"
              }`}>
                {job.status}
              </span>
            </div>

            <div className="space-y-1 mb-8">
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{job.title}</h3>
              <p className="text-xs font-medium text-text-secondary">{job.dept} &middot; {job.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-surface-2 border border-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-text-muted">
                  <FiUsers size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Candidates</span>
                </div>
                <p className="text-lg font-black text-white">{job.candidates}</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-2 border border-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-text-muted">
                  <FiClock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Interviews</span>
                </div>
                <p className="text-lg font-black text-white">{job.interviews}</p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border-subtle flex items-center justify-between">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Posted {job.posted}</p>
              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-2 border border-border-medium text-text-muted hover:text-white transition-all">
                <FiMoreHorizontal />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
