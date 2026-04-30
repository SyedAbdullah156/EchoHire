"use client";

import { motion } from "framer-motion";
import { FiCheckSquare, FiArrowUpRight } from "react-icons/fi";

type ActionAlertProps = { title: string; items: string[] };

export default function ActionAlert({ title, items }: ActionAlertProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-[2rem] border border-border-medium bg-surface-2/60 p-6 backdrop-blur-xl shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary uppercase tracking-widest">To-Do</span>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-border-subtle bg-background/50 p-4 transition-all hover:bg-surface-2"
          >
            <div className="flex items-center gap-3">
              <FiCheckSquare className="text-primary group-hover:text-primary" />
              <span className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors">{item}</span>
            </div>
            <FiArrowUpRight size={14} className="text-text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}