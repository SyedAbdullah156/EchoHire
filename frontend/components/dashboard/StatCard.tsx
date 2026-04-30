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
  className?: string;
  badge?: string;
};

export default function StatCard({ 
  title, value, subtitle, ctaLabel, ctaHref, icon: Icon, ctaTitle, className, badge 
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-border-medium bg-card-bg p-6 backdrop-blur-xl transition-colors hover:border-primary/40",
        className
      )}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-widest text-text-secondary">{title}</p>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="px-2 py-0.5 rounded-lg bg-primary/20 text-[10px] font-black text-primary border border-primary/20 animate-pulse">
                {badge}
              </span>
            )}
            <div className="p-2 rounded-xl border border-border-medium bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon size={20} />
            </div>
          </div>
        </div>
        <p className="text-2xl font-black tracking-tight text-foreground md:text-3xl">{value}</p>
        {subtitle && <p className="mt-1 text-sm font-medium text-text-muted">{subtitle}</p>}
      </div>

      <Link
        href={ctaHref}
        title={ctaTitle}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-surface-2 border border-border-medium py-2.5 text-sm font-bold text-foreground transition-all hover:bg-primary hover:border-blue-500 active:scale-95"
      >
        {ctaLabel}
      </Link>
    </motion.div>
  );
}