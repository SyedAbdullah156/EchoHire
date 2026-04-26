"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  icon: IconType;
};

export default function StatCard({ title, value, subtitle, ctaLabel, ctaHref, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)] backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-semibold text-[#e6eeff] md:text-lg">{title}</p>
        <div className="rounded-lg border border-white/10 bg-[#111f39]/60 p-2 text-[#9ec2ff]">
          <Icon size={17} />
        </div>
      </div>
      <p className="text-lg text-[#d5e0f7] md:text-2xl">{value}</p>
      {subtitle ? <p className="text-sm text-[#acc0e9] md:text-base">{subtitle}</p> : null}
      <Link
        href={ctaHref}
        className="mt-4 inline-flex rounded-lg border border-white/10 bg-[#17243f]/70 px-4 py-2 text-sm text-[#e3ebff] transition hover:bg-[#21345a] md:text-base"
      >
        {ctaLabel}
      </Link>
    </motion.div>
  );
}
