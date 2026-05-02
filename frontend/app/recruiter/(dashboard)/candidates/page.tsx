"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiCheck, 
  FiArrowRight, 
  FiMail, 
  FiCpu, 
  FiAlertCircle, 
  FiActivity,
  FiZap,
  FiUser
} from "react-icons/fi";

// --- Types & Mock Data ---

interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  matchType: "High Match" | "Strong" | "Good" | "Fair";
  skills: string[];
  status: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendedQuestions: string[];
  };
}

const CANDIDATES: Candidate[] = [
  {
    id: "CAN-8821",
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    score: 94,
    matchType: "High Match",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    status: "Interview Scheduled",
    analysis: {
      strengths: ["Expert React architecture knowledge", "Strong systems design thinking", "Excellent communication skills"],
      weaknesses: ["Limited experience with Python/Back-end frameworks", "Has not led a team larger than 5 people"],
      recommendedQuestions: ["How would you optimize a large-scale React application?", "Describe a time you resolved a technical conflict."]
    }
  },
  {
    id: "CAN-8822",
    name: "Sarah Chen",
    role: "Product Designer",
    score: 88,
    matchType: "Strong",
    skills: ["Figma", "Design Systems", "Prototyping"],
    status: "Review Pending",
    analysis: {
      strengths: ["Strong visual design aesthetic", "Mastery of Figma components", "User-centric approach"],
      weaknesses: ["Less experience with front-end code handoff", "Limited case studies on enterprise SaaS"],
      recommendedQuestions: ["How do you handle stakeholder feedback that contradicts your research?", "Explain your design process for complex data tables."]
    }
  },
  {
    id: "CAN-8823",
    name: "Marcus Thorne",
    role: "Backend Developer",
    score: 76,
    matchType: "Good",
    skills: ["Python", "Go", "PostgreSQL", "Docker"],
    status: "Screened",
    analysis: {
      strengths: ["Clean, performant Go code", "Deep understanding of database optimization"],
      weaknesses: ["Limited cloud infrastructure experience", "Short tenure at previous two roles"],
      recommendedQuestions: ["Explain how you optimize a slow database query.", "What is your approach to microservices orchestration?"]
    }
  }
];

// --- Sub-components ---

function CandidateRow({ candidate, onClick }: { candidate: Candidate; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ backgroundColor: "var(--surface-2)" }}
      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-surface-1 border-b border-border-subtle cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4 min-w-[240px]">
        <div className="h-10 w-10 rounded-xl bg-surface-2 border border-border-medium flex items-center justify-center text-primary font-black">
          {candidate.name[0]}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{candidate.name}</h3>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{candidate.id}</p>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex-1 px-4">
        <p className="text-xs font-medium text-text-secondary">{candidate.role}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {candidate.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-bold text-text-muted uppercase tracking-wider">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-8">
        <div className="text-center">
          <span className={`inline-flex px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
            candidate.matchType === "High Match" ? "bg-emerald-500/10 text-emerald-500" :
            candidate.matchType === "Strong" ? "bg-primary/10 text-primary" : "bg-surface-2 text-text-muted"
          }`}>
            {candidate.matchType}
          </span>
          <p className="text-[10px] font-bold text-white mt-1.5">{candidate.score}% Match</p>
        </div>
        <FiArrowRight className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}

// --- Main Page Component ---

export default function CandidateDirectory() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestContact = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setRequestSent(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-full">
      <div className="p-8 lg:p-12 space-y-10">
        
        {/* --- Header & Filters --- */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-3xl font-black text-white tracking-tight">Candidate Directory</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search by name or skills..."
                  className="h-11 w-64 bg-surface-1 border border-border-medium rounded-xl pl-12 pr-4 text-xs text-white outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <button className="h-11 px-4 flex items-center gap-2 rounded-xl bg-surface-1 border border-border-medium text-xs font-bold text-text-muted hover:text-white transition-all">
                <FiFilter /> Filters
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
             {["All Candidates", "Engineers", "Designers", "Product", "High Match", "Recently Analyzed"].map((chip, i) => (
               <button 
                 key={chip}
                 className={`h-9 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                   i === 0 ? "bg-primary text-white" : "bg-surface-1 border border-border-medium text-text-muted hover:border-primary/50"
                 }`}
               >
                 {chip}
               </button>
             ))}
          </div>
        </div>

        {/* --- List View --- */}
        <div className="bg-surface-1 border border-border-medium rounded-[2.5rem] overflow-hidden">
          <div className="flex flex-col">
            {CANDIDATES.map((candidate) => (
              <CandidateRow 
                key={candidate.id} 
                candidate={candidate} 
                onClick={() => {
                  setSelectedCandidate(candidate);
                  setRequestSent(false);
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- Detail Drawer --- */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            />

            {/* Side Panel (Drawer) */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              aria-expanded={!!selectedCandidate}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[560px] bg-surface-2 border-l border-border-medium z-[101] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-8 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xl">
                    <FiUser />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCandidate.name}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{selectedCandidate.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-muted transition-colors"
                >
                  <FiX />
                </button>
              </div>

              {/* Drawer Content (Bento Grid) */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                
                {/* AI Score Card */}
                <div className="p-8 rounded-[2rem] bg-surface-1 border border-border-medium relative overflow-hidden group">
                  <div className="relative z-10 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-primary">
                      <FiCpu />
                      <span className="text-xs font-black uppercase tracking-widest">AI Profile Analysis</span>
                    </div>
                    <span className="text-3xl font-black text-white">{selectedCandidate.score}%</span>
                  </div>
                  <div className="relative h-2 bg-surface-2 rounded-full mb-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedCandidate.score}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute inset-0 bg-primary rounded-full" 
                    />
                  </div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Confidence Score &bull; Optimized for {selectedCandidate.role}</p>
                  
                  <div className="absolute top-0 right-0 h-full w-32 bg-primary/5 blur-3xl pointer-events-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <FiZap size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Strengths</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedCandidate.analysis.strengths.map((s, i) => (
                        <li key={i} className="text-[11px] text-emerald-500/80 leading-relaxed">&bull; {s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 space-y-4">
                    <div className="flex items-center gap-2 text-rose-500">
                      <FiAlertCircle size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Considerations</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedCandidate.analysis.weaknesses.map((w, i) => (
                        <li key={i} className="text-[11px] text-rose-500/80 leading-relaxed">&bull; {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Questions */}
                <div className="p-6 rounded-3xl bg-surface-1 border border-border-medium space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <FiActivity size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Recommended Interview Questions</span>
                  </div>
                  <div className="space-y-3">
                    {selectedCandidate.analysis.recommendedQuestions.map((q, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-surface-2 border border-border-subtle text-[11px] text-text-secondary italic leading-relaxed">
                        &ldquo;{q}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer (Action Section) */}
              <div className="p-8 bg-surface-1 border-t border-border-subtle">
                <AnimatePresence mode="wait">
                  {requestSent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-3 h-14 w-full rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-widest"
                    >
                      <FiCheck /> Request Sent to Admin
                    </motion.div>
                  ) : (
                    <motion.button
                      key="action"
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={handleRequestContact}
                      disabled={isRequesting}
                      className="h-14 w-full rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isRequesting ? "Processing..." : "Request Direct Contact"}
                      {!isRequesting && <FiMail />}
                    </motion.button>
                  )
                  }
                </AnimatePresence>
                <p className="mt-4 text-center text-[10px] text-text-muted leading-relaxed">
                  Admins will review and provide contact details within 4 hours.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
