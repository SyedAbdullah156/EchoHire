"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiChevronRight, FiCpu } from "react-icons/fi";

interface QuizInterfaceProps {
  question: string;
  onAnswer: (answer: string) => void;
  isSubmitting: boolean;
}

export default function QuizInterface({ question, onAnswer, isSubmitting }: QuizInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Parse the question and options from AI text
  // Expected format: "Question... \n A) ... \n B) ... \n C) ... \n D) ..."
  const lines = question.split("\n").filter(l => l.trim());
  const questionText = lines[0];
  const options = lines.slice(1).filter(l => /^[A-D]\)/.test(l.trim()));

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
      setSelectedOption(null);
    }
  };

  return (
    <div className="p-8 rounded-[3rem] bg-surface-1 border border-primary/20 space-y-8 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <FiCpu size={20} />
        </div>
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Technical Quiz Phase</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white leading-relaxed">{questionText}</h2>

        <div className="grid gap-3">
          {options.map((opt) => {
            const letter = opt.trim()[0];
            const isSelected = selectedOption === letter;
            return (
              <button
                key={letter}
                onClick={() => setSelectedOption(letter)}
                disabled={isSubmitting}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  isSelected 
                    ? "bg-primary/20 border-primary text-white" 
                    : "bg-surface-2 border-white/5 text-text-muted hover:border-primary/40 hover:bg-surface-1"
                }`}
              >
                <span className="text-sm font-medium">{opt}</span>
                <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${
                  isSelected ? "bg-primary border-primary text-white" : "border-white/10 group-hover:border-primary/40"
                }`}>
                  {isSelected && <FiCheck size={14} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || isSubmitting}
        className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? "Processing..." : "Submit Answer"} <FiChevronRight />
      </button>
    </div>
  );
}
