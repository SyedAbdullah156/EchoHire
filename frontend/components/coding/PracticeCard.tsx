"use client";

import React from "react";
import { FiCode, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

interface PracticeCardProps {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  onPractice: () => void;
}

export default function PracticeCard({ title, difficulty, description, onPractice }: PracticeCardProps) {
  const difficultyColor = {
    Easy: "text-emerald-400 bg-emerald-400/10",
    Medium: "text-amber-400 bg-amber-400/10",
    Hard: "text-rose-400 bg-rose-400/10",
  }[difficulty];

  return (
    <motion.div
      whileHover={{ y: -4, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
      className="p-8 rounded-[2.5rem] bg-[#0d162a] border border-slate-800 transition-all flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <FiCode size={20} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${difficultyColor}`}>
            {difficulty}
          </span>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onPractice}
        className="mt-8 w-full py-4 rounded-2xl bg-[#050b18] border border-slate-800 text-xs font-bold text-white hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center justify-center gap-2 group"
      >
        Practice Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
