"use client";

import { motion } from "framer-motion";

type ActionAlertProps = {
  title: string;
  items: string[];
};

export default function ActionAlert({ title, items }: ActionAlertProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)] backdrop-blur-xl"
    >
      <p className="mb-3 text-2xl font-semibold text-[#e6eeff] md:text-3xl">{title}</p>
      <ul className="space-y-2 text-sm text-[#c9d8fa] md:text-base">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-white/10 bg-[#101b32]/70 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
