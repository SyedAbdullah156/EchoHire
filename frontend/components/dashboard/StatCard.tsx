"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  icon: IconType;
  ctaTitle?: string;
  className?: string; // Added to fix the previous error
};

export default function StatCard({ 
  title, value, subtitle, ctaLabel, ctaHref, icon: Icon, ctaTitle, className 
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d162a]/80 p-6 backdrop-blur-xl transition-colors hover:border-blue-500/40",
        className
      )}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-widest text-[#94a9d2]">{title}</p>
          <div className="rounded-xl border border-white/10 bg-blue-500/10 p-2.5 text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
            <Icon size={20} />
          </div>
        </div>
        <p className="text-2xl font-black tracking-tight text-white md:text-3xl">{value}</p>
        {subtitle && <p className="mt-1 text-sm font-medium text-[#7a8eb9]">{subtitle}</p>}
      </div>

      <Link
        href={ctaHref}
        title={ctaTitle}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:border-blue-500 active:scale-95"
      >
        {ctaLabel}
      </Link>
    </motion.div>
  );
}