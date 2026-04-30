"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCpu,
  FiCheckCircle,
  FiFileText,
  FiMapPin,
  FiZap,
  FiChevronRight,
  FiPlus,
  FiTrash2,
  FiHelpCircle
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/date-picker";

const TECH_STACK_OPTIONS = ["React", "TypeScript", "Node.js", "Python", "Go", "AWS", "Docker", "PostgreSQL", "Next.js"];
const SOFT_SKILLS = ["Leadership", "Communication", "Problem Solving", "Collaboration", "Critical Thinking"];

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState(""); // This is the Role
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState(5);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions([...customQuestions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title || !description || !deadline || !location) {
      return toast.error("Please fill in all required fields.");
    }

    if (description.length < 20) {
      return toast.error("Description must be at least 20 characters long.");
    }

    if (selectedTech.length === 0) {
      return toast.error("Please select at least one tech stack focus.");
    }

    setIsPublishing(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${department} - ${title}`,
          role: title,
          description: description,
          location: location,
          salary_range: salaryRange || "Competitive",
          department: department,
          difficulty: difficulty,
          soft_skills: selectedSoftSkills,
          framework: selectedTech,
          requirements: [...selectedTech, ...selectedSoftSkills],
          custom_questions: customQuestions,
          deadline: deadline?.toISOString(),
          rounds: [
            { type: "TechnicalScreening", max_questions: 5 },
            { type: "FrameworkProficiency", max_questions: 5 },
            { type: "CodingAssessment", max_questions: 5 },
            { type: "SystemArchitecture", max_questions: 5 }
          ],
          is_active: true
        }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Job Posting Published Successfully!");
        router.push("/recruiter/jobs");
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: { message: string }) => {
            toast.error(err.message);
          });
        } else {
          toast.error(result.message || "Failed to publish job.");
        }
      }
    } catch (error) {
      toast.error("Failed to connect to the server.");
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleTech = (tech: string) => {
    setSelectedTech(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]);
  };

  const toggleSoftSkill = (skill: string) => {
    setSelectedSoftSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 pb-32">

      {/* --- Breadcrumbs --- */}
      <nav className="mb-12 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-muted">
        <Link href="/recruiter/jobs" className="hover:text-primary transition-colors">Jobs</Link>
        <FiChevronRight className="opacity-30" />
        <span className="text-foreground">Create New Posting</span>
      </nav>

      <div className="space-y-12">

        {/* --- Header Section --- */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">
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
            <h2 className="text-xl font-bold text-foreground">Basic Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="job-title" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Job Role</label>
              <input
                id="job-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl px-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dept" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Department</label>
              <select
                id="dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl px-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>Operations</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Job Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full h-32 bg-surface-2 border border-border-medium rounded-2xl p-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Location</label>
              <div className="relative">
                <FiMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA (Hybrid)"
                  className="w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl pl-14 pr-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 text-flex items-center gap-2">
                Application Deadline
              </label>
              <DatePicker 
                date={deadline} 
                setDate={setDeadline} 
                placeholder="Select deadline date" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="salary" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Salary Range</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</div>
                <input
                  id="salary"
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. 120k - 150k"
                  className="w-full h-[52px] bg-surface-2 border border-border-medium rounded-2xl pl-12 pr-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                />
              </div>
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <p className="text-[9px] text-text-muted font-medium italic">This will be visible to candidates on the job board.</p>
            </div>
          </div>
        </section>

        {/* --- Section 2: AI Assessment Configuration --- */}
        <section className="p-10 rounded-[2.5rem] bg-surface-1 border border-border-medium space-y-10">
          <div className="flex items-center gap-4 text-primary">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
              <FiCpu />
            </div>
            <h2 className="text-xl font-bold text-foreground">AI Assessment Setup</h2>
          </div>

          {/* Difficulty Slider */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Technical Difficulty</label>
              <span className="px-3 py-1 rounded-lg bg-primary text-[10px] font-black text-foreground">{difficulty}/10</span>
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
                  onClick={() => toggleTech(tech)}
                  className={`h-10 px-4 rounded-xl border text-xs font-bold transition-all active:scale-95 ${selectedTech.includes(tech) ? "border-primary bg-primary/10 text-foreground shadow-lg shadow-primary/20" : "border-border-medium text-text-muted hover:border-primary/50 hover:text-foreground"
                    }`}
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
                  onClick={() => toggleSoftSkill(skill)}
                  className={`h-10 px-4 rounded-xl border text-xs font-bold transition-all active:scale-95 ${selectedSoftSkills.includes(skill) ? "border-primary bg-primary/10 text-foreground shadow-lg shadow-primary/20" : "border-border-medium text-text-muted hover:border-primary/50 hover:text-foreground"
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- Section 3: Custom Question Bank --- */}
        <section className="p-10 rounded-[2.5rem] bg-surface-1 border border-border-medium space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-primary">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
                <FiHelpCircle />
              </div>
              <h2 className="text-xl font-bold text-foreground">Question Bank</h2>
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{customQuestions.length} Custom Questions</span>
          </div>

          <div className="space-y-6">
            <p className="text-xs text-text-secondary leading-relaxed">
              Add specific questions you want the AI to include during the interview rounds. Leave empty to let the AI generate everything automatically.
            </p>

            <div className="flex gap-4">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                placeholder="Enter a specific question (e.g. Describe your experience with Microservices)"
                className="flex-1 h-[52px] bg-surface-2 border border-border-medium rounded-2xl px-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
              />
              <button
                onClick={handleAddQuestion}
                className="h-[52px] px-6 rounded-2xl bg-surface-2 border border-border-medium text-foreground hover:border-primary transition-all flex items-center gap-2"
              >
                <FiPlus />
              </button>
            </div>

            <div className="grid gap-3">
              <AnimatePresence>
                {customQuestions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 rounded-2xl bg-surface-2 border border-border-subtle flex items-center justify-between group"
                  >
                    <p className="text-xs text-foreground">{q}</p>
                    <button
                      onClick={() => removeQuestion(i)}
                      className="p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
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
                className="flex-1 sm:flex-none h-12 px-6 rounded-xl border border-border-medium text-xs font-bold text-foreground flex items-center justify-center hover:bg-surface-2"
              >
                Save Draft
              </Link>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-primary text-foreground text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 transition-all"
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
