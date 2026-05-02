"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, 
  FiCpu, 
  FiCheckCircle, 
  FiFileText, 
  FiMapPin, 
  FiZap,
  FiChevronRight
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TECH_STACK_OPTIONS = ["React", "TypeScript", "Node.js", "Python", "Go", "AWS", "Docker", "PostgreSQL", "Next.js"];
const SOFT_SKILLS = ["Leadership", "Communication", "Problem Solving", "Collaboration", "Critical Thinking"];

export default function NewJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [difficulty, setDifficulty] = useState(5);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      toast.success("Job Posting Published Successfully!");
      router.push("/recruiter/jobs");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 pb-32">
      
      {/* --- Breadcrumbs --- */}
      <nav className="mb-12 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-muted">
        <Link href="/recruiter/jobs" className="hover:text-primary transition-colors">Jobs</Link>
        <FiChevronRight className="opacity-30" />
        <span className="text-white">Create New Posting</span>
      </nav>

      <div className="space-y-12">
        
        {/* --- Header Section --- */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Design Your <span className="text-primary text-glow">Ideal Candidate</span> Profile.
          </h1>
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Fill in the details below. Our AI will automatically configure the interview parameters based on your requirements.
          </p>
        </div>

        {/* --- Section 1: Basic Details --- */}
        <section className="p-10 rounded-[2.5rem] bg-surface-1 border border-border-medium space-y-8">
          <div className="flex items-center gap-4 text-primary">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
              <FiFileText />
            </div>
            <h2 className="text-xl font-bold text-white">Basic Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="job-title" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Job Title</label>
              <input 
                id="job-title"
                type="text" 
                placeholder="e.g. Senior Frontend Engineer" 
                className="w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl px-6 text-sm text-white outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dept" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Department</label>
              <select 
                id="dept"
                className="w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl px-6 text-sm text-white outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>Operations</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 text-flex items-center gap-2">
               Location <span className="text-[9px] lowercase opacity-50 font-normal italic">(Remote, Hybrid, On-site)</span>
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                id="location"
                type="text" 
                placeholder="e.g. San Francisco, CA (Hybrid)" 
                className="w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl pl-14 pr-6 text-sm text-white outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
              />
            </div>
          </div>
        </section>

        {/* --- Section 2: AI Assessment Configuration --- */}
        <section className="p-10 rounded-[2.5rem] bg-surface-1 border border-border-medium space-y-10">
          <div className="flex items-center gap-4 text-primary">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
              <FiCpu />
            </div>
            <h2 className="text-xl font-bold text-white">AI Assessment Setup</h2>
          </div>

          {/* Difficulty Slider */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Technical Difficulty</label>
              <span className="px-3 py-1 rounded-lg bg-primary text-[10px] font-black text-white">{difficulty}/10</span>
            </div>
            <div className="relative h-2 bg-surface-2 rounded-full">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <motion.div 
                className="h-full bg-primary rounded-full relative"
                animate={{ width: `${(difficulty / 10) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-4 border-primary shadow-lg" />
              </motion.div>
            </div>
            <div className="flex justify-between px-1">
              <span className="text-[9px] font-bold text-text-muted uppercase">Junior</span>
              <span className="text-[9px] font-bold text-text-muted uppercase">Architect</span>
            </div>
          </div>

          {/* Multi-Select Toggles */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Stack focus</label>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK_OPTIONS.map(tech => (
                <button 
                  key={tech}
                  className="h-10 px-4 rounded-xl border border-border-medium text-xs font-bold text-text-muted hover:border-primary/50 hover:text-white transition-all active:scale-95"
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Soft Skills priority</label>
            <div className="flex flex-wrap gap-2">
              {SOFT_SKILLS.map(skill => (
                <button 
                  key={skill}
                  className="h-10 px-4 rounded-xl border border-border-medium text-xs font-bold text-text-muted hover:border-primary/50 hover:text-white transition-all active:scale-95"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- Action Bar --- */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-50">
          <div className="p-4 rounded-[2rem] bg-surface-1/80 backdrop-blur-xl border border-border-medium flex items-center justify-between">
            <div className="flex items-center gap-4 px-4 hidden sm:flex">
              <FiZap className="text-primary" />
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AI Config Optimized</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link 
                href="/recruiter/dashboard"
                className="flex-1 sm:flex-none h-12 px-6 rounded-xl border border-border-medium text-xs font-bold text-white flex items-center justify-center hover:bg-surface-2"
              >
                Save Draft
              </Link>
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isPublishing ? "Processing..." : "Publish & Activate AI"}
                {!isPublishing && <FiCheckCircle />}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
