"use client";

import { useState, useEffect } from "react";
import { 
  FiSearch, FiMapPin, FiDollarSign, FiChevronRight, FiCheckCircle, 
  FiX, FiUploadCloud, FiZap 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  role: string;
  company_id?: { name: string };
  type?: string;
  location?: string;
  salary_range?: string;
  requirements?: string[];
}

interface Interview {
  _id: string;
  job_id?: { _id: string };
  assessment_token?: string;
  join_code?: string;
}

export default function BrowseJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [myInterviews, setMyInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, interviewsRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/interviews/my")
        ]);
        
        const jobsData = await jobsRes.json();
        const interviewsData = await interviewsRes.json();
        
        if (jobsRes.ok) setJobs(jobsData.data || []);
        if (interviewsRes.ok) setMyInterviews(interviewsData.data || []);
      } catch {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !selectedJob) return toast.error("Please upload your CV first.");

    setIsApplying(true);
    const formData = new FormData();
    formData.append("job_id", selectedJob._id);
    formData.append("cv", cvFile);

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Application submitted! Redirecting to interview...");
        router.push(`/candidate/ai-interview?id=${result.data._id}&round=0`);
      } else {
        toast.error(result.message || "Application failed.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company_id?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 p-4 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight">Browse Jobs</h1>
          <p className="text-text-muted">Find your next role and start an AI-powered interview immediately.</p>
        </div>
        
        <div className="relative group w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search roles, companies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-surface-1 border border-border-medium rounded-2xl pl-12 pr-4 text-sm text-foreground placeholder:text-text-muted focus:border-primary/50 outline-none transition-all"
          />
        </div>
      </header>

      {/* Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job, i) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-[2.5rem] bg-surface-1 border border-border-medium hover:border-primary/30 transition-all group flex flex-col justify-between shadow-xl shadow-black/20"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border-medium flex items-center justify-center font-black text-primary text-xl">
                    {job.company_id?.name?.[0] || "J"}
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    {job.type || "Full Time"}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{job.role}</h3>
                  <p className="text-sm text-text-muted font-medium">{job.company_id?.name || "Global Tech"}</p>
                </div>

                {/* Status / IDs if applied */}
                {myInterviews.find(i => i.job_id?._id === job._id) ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      <FiCheckCircle /> Application Active
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Interview ID</p>
                      <code className="text-[10px] text-foreground block bg-black/20 p-1.5 rounded-lg select-all">
                        {myInterviews.find(i => i.job_id?._id === job._id)?._id}
                      </code>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Join Code</p>
                      <code className="text-[10px] text-primary block bg-primary/10 p-1.5 rounded-lg select-all font-black text-center">
                        {myInterviews.find(i => i.job_id?._id === job._id)?.join_code}
                      </code>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-4 py-4 border-y border-border-subtle">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <FiMapPin className="text-primary" /> {job.location || "Remote"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <FiDollarSign className="text-primary" /> {job.salary_range || "$80k - $120k"}
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-xs font-bold text-foreground uppercase tracking-widest">Key Skills</p>
                       <div className="flex flex-wrap gap-2">
                          {job.requirements?.slice(0, 3).map((req: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 rounded-md bg-surface-2 text-[10px] text-text-muted border border-border-subtle">
                              {req}
                            </span>
                          ))}
                       </div>
                    </div>
                  </>
                )}
              </div>

              {myInterviews.find(i => i.job_id?._id === job._id) ? (
                <button 
                  onClick={() => router.push(`/candidate/ai-interview?id=${myInterviews.find(i => i.job_id?._id === job._id)?._id}&round=0`)}
                  className="mt-8 w-full h-14 rounded-2xl bg-emerald-600 text-foreground font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  Resume Interview <FiChevronRight />
                </button>
              ) : (
                <button 
                  onClick={() => setSelectedJob(job)}
                  className="mt-8 w-full h-14 rounded-2xl bg-surface-2 group-hover:bg-primary text-foreground font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                >
                  Apply Now <FiChevronRight />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setSelectedJob(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-lg bg-surface-1 border border-border-medium rounded-[3rem] p-10 shadow-2xl"
             >
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-8 right-8 text-text-muted hover:text-foreground transition-colors"
                >
                  <FiX size={24} />
                </button>

                <div className="space-y-8">
                   <div className="space-y-2 text-center">
                      <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                         <FiZap size={32} />
                      </div>
                      <h2 className="text-2xl font-black text-foreground">Apply for {selectedJob.role}</h2>
                      <p className="text-sm text-text-muted">Upload your CV to start the AI evaluation process.</p>
                   </div>

                   <form onSubmit={handleApply} className="space-y-6">
                      <div className="relative group">
                         <input 
                           type="file" 
                           accept=".pdf,.doc,.docx"
                           onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                           className="hidden" 
                           id="cv-upload" 
                         />
                         <label 
                           htmlFor="cv-upload"
                           className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border-medium rounded-[2rem] bg-surface-2/50 hover:border-primary/50 transition-all cursor-pointer group"
                         >
                            {cvFile ? (
                              <div className="flex items-center gap-3 text-primary">
                                 <FiCheckCircle size={24} />
                                 <span className="text-sm font-bold">{cvFile.name}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-text-muted group-hover:text-primary transition-colors">
                                 <FiUploadCloud size={32} />
                                 <span className="text-xs font-bold uppercase tracking-widest">Select CV (PDF)</span>
                              </div>
                            )}
                         </label>
                      </div>

                      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                           <FiZap /> AI Ready
                         </p>
                         <p className="text-xs text-text-secondary leading-relaxed">
                            Once submitted, our AI will analyze your CV against the job requirements and start the first interview round immediately.
                         </p>
                      </div>

                      <button 
                        type="submit"
                        disabled={isApplying || !cvFile}
                        className="w-full h-16 rounded-2xl bg-primary text-foreground font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
                      >
                        {isApplying ? "Processing..." : "Submit Application"}
                      </button>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
