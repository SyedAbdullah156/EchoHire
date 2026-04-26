"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCalendar, FiTarget, FiZap } from "react-icons/fi";

type QuickActionsFabProps = {
  streak: number;
};

const actions = [
  { href: "/ai-interview", label: "Start AI Interview", icon: FiZap },
  { href: "/resume-analyzer", label: "Analyze Resume", icon: FiTarget },
  { href: "/dashboard?completeProfile=1", label: "Plan Today", icon: FiCalendar },
];

export default function QuickActionsFab({ streak }: QuickActionsFabProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-5 z-40 hidden xl:block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-[270px] rounded-2xl border border-white/10 bg-[#0e1b33]/80 p-4 text-[#e8efff] shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      >
        <p className="text-sm uppercase tracking-[0.18em] text-[#9bb5e8]">Daily Streak</p>
        <p className="mb-3 mt-1 text-2xl font-semibold">{streak} days in a row</p>
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#152546]/80 px-3 py-2 text-sm transition hover:bg-[#203863]"
              >
                <Icon className="text-[#9ec2ff]" />
                <span>{action.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
