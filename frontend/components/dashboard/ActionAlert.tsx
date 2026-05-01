"use client";

import { motion } from "framer-motion";
import { FiCheckSquare, FiArrowUpRight } from "react-icons/fi";

type ActionAlertProps = { title: string; items: string[] };

export default function ActionAlert({ title, items }: ActionAlertProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-[2rem] border border-white/10 bg-[#0d162a]/60 p-6 backdrop-blur-xl shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black text-blue-400 uppercase tracking-widest">To-Do</span>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-[#050b18]/50 p-4 transition-all hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <FiCheckSquare className="text-blue-500 group-hover:text-blue-400" />
              <span className="text-sm font-medium text-[#cfd9f3] group-hover:text-white transition-colors">{item}</span>
            </div>
            <FiArrowUpRight size={14} className="text-[#4a5d89] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}