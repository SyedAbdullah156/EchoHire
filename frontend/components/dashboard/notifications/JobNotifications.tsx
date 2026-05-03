"use client";

import { useEffect, useState } from "react";
import { FiBriefcase, FiBell, FiChevronRight, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function JobNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestJobs() {
      try {
        const res = await fetch("/api/jobs");
        const result = await res.json();
        if (res.ok) {
          // Take the latest 3 jobs as "New Notifications"
          const latest = (result.data || []).slice(0, 3);
          setNotifications(latest);
        }
      } catch (error) {
        console.error("Failed to fetch job notifications", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestJobs();
  }, []);

  if (loading) return null;
  if (notifications.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.5rem] border border-blue-500/10 bg-[#0d162a]/80 p-8 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FiBell className="text-blue-500" /> Job Alerts
        </h2>
        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[10px] font-black text-blue-500 uppercase">New</span>
      </div>

      <div className="space-y-4">
        {notifications.map((job) => (
          <Link 
            key={job._id}
            href="/candidate/jobs"
            className="block group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FiBriefcase />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{job.role}</h4>
                  <p className="text-[10px] text-text-muted font-medium mt-0.5">{job.company_id?.name || "Global Hiring"}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[9px] text-blue-500/60 font-bold uppercase tracking-widest">
                     <FiClock /> Just Posted
                  </div>
                </div>
              </div>
              <FiChevronRight className="text-text-muted group-hover:text-white transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <Link 
        href="/candidate/jobs"
        className="mt-6 w-full flex items-center justify-center py-3 rounded-xl border border-white/5 text-[10px] font-black text-text-muted uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
      >
        View All Opportunities
      </Link>
    </motion.div>
  );
}
