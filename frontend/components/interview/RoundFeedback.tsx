"use client";

import { motion } from "framer-motion";
import { FiCheckCircle, FiAward, FiChevronRight, FiHome } from "react-icons/fi";

type RoundFeedbackProps = {
  roundIndex: number;
  result: any;
  isLastRound: boolean;
  onNext: () => void;
  onFinish: () => void;
};

export default function RoundFeedback({ roundIndex, result, isLastRound, onNext, onFinish }: RoundFeedbackProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full p-12 rounded-[3.5rem] bg-surface-1 border border-white/10 text-center space-y-10 shadow-2xl shadow-primary/5"
      >
        <div className="mx-auto w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
           <FiCheckCircle size={48} />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            Round {roundIndex + 1} <span className="text-emerald-500">Concluded</span>
          </h2>
          <p className="text-sm text-text-muted max-w-sm mx-auto">
            The AI has processed your technical responses. Your performance data has been synchronized.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 py-10 border-y border-white/5">
           <div className="p-8 rounded-[2rem] bg-surface-2 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><FiAward size={40} /></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Technical Proficiency</p>
              <p className="text-4xl font-black text-primary">{result?.score || 0}%</p>
           </div>
           <div className="p-8 rounded-[2rem] bg-surface-2 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Outcome</p>
              <p className="text-3xl font-black text-emerald-500 uppercase tracking-tighter">Verified</p>
           </div>
        </div>

        <div className="text-left space-y-4">
          <h4 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest">
             AI Feedback Report
          </h4>
          <div className="p-8 rounded-[2.5rem] bg-surface-2/40 border border-white/5 text-sm text-text-secondary leading-relaxed italic relative">
             <span className="absolute top-4 left-4 text-primary text-4xl font-serif opacity-20">“</span>
             {result?.remarks || "Excellent technical communication demonstrated throughout the assessment."}
             <span className="absolute bottom-4 right-4 text-primary text-4xl font-serif opacity-20 rotate-180">“</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button 
            onClick={onFinish}
            className="flex-1 h-16 rounded-2xl bg-surface-2 border border-white/10 text-white font-bold hover:bg-surface-3 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <FiHome /> Dashboard
          </button>
          
          {!isLastRound ? (
            <button 
              onClick={onNext}
              className="flex-[2] h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 group"
            >
              Start Next Round <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={onFinish}
              className="flex-[2] h-16 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Complete Interview
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
