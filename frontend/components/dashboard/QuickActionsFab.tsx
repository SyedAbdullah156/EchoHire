"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCalendar, FiTarget, FiZap, FiChevronRight, FiMaximize2, FiMinimize2 } from "react-icons/fi";

const actions = [
  { href: "/ai-interview", label: "Start AI Interview", icon: FiZap, color: "text-yellow-400" },
  { href: "/resume-analyzer", label: "Analyze Resume", icon: FiTarget, color: "text-emerald-400" },
  { href: "/dashboard?completeProfile=1", label: "Plan Today", icon: FiCalendar, color: "text-primary" },
];

export default function QuickActionsFab() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-5 right-28 z-50 hidden xl:block">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mb-3 ml-auto flex items-center gap-2 rounded-xl border border-border-medium bg-[#0e1b33]/90 px-3 py-2 text-xs font-bold text-foreground shadow-lg backdrop-blur-2xl transition hover:bg-[#14284a]"
          aria-label={isExpanded ? "Minimize daily progress panel" : "Expand daily progress panel"}
        >
          <FiZap className="text-orange-400" size={20} />
          <span>Quick Actions</span>
          {isExpanded ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
        </button>

        {isExpanded && (
          <div className="w-[300px] overflow-hidden rounded-[2rem] border border-border-medium bg-[#0e1b33]/90 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Daily Progress</p>
                <p className="text-2xl font-black text-foreground">Today&apos;s Plan</p>
              </div>
              <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <FiZap size={20} fill="currentColor" />
              </div>
            </div>

            <div className="space-y-3">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-[#152546]/50 p-4 transition-all hover:bg-primary hover:translate-x-2"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className={action.color} size={18} />
                    <span className="text-sm font-bold group-hover:text-foreground">{action.label}</span>
                  </div>
                  <FiChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}