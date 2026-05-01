"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { FiCheckCircle, FiUploadCloud, FiInfo, FiArrowLeft, FiAlertCircle, FiLoader, FiSearch, FiCpu, FiBarChart } from "react-icons/fi";
import { toast } from "sonner";

type LinkedinOptimizerResult = {
  overallScore: number;
  issues: string[];
  suggestedImprovements: string[];
  improvedHeadline: string;
};

// HCI Loading Steps
const LOADING_STEPS = [
  { label: "Parsing PDF structure...", icon: <FiSearch /> },
  { label: "AI analyzing keywords...", icon: <FiCpu /> },
  { label: "Calculating recruiter impact...", icon: <FiBarChart /> },
  { label: "Finalizing insights...", icon: <FiCheckCircle /> },
];

export default function LinkedinOptimizerPage() {
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<LinkedinOptimizerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";

  // Progress Step Simulator (HCI Improvement)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  // Smooth Count-up animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        if (prev < targetScore) return prev + 1;
        if (prev > targetScore) return targetScore;
        clearInterval(interval);
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [targetScore]);

  const recommendations = useMemo(() => analysis?.suggestedImprovements?.slice(0, 8) ?? [], [analysis]);
  const issues = useMemo(() => analysis?.issues?.slice(0, 10) ?? [], [analysis]);

  const onPdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Format error: Please select a valid PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Size limit: PDF must be 5MB or smaller.");
      return;
    }

    setPdfFile(file);
    toast.success("PDF attached successfully.");
  };

  const analyzeProfile = async () => {
    setErrorMessage("");
    setAnalysis(null);
    setScore(0);
    setTargetScore(0);
    
    if (!pdfFile) return toast.error("Please upload your PDF export first.");

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      const response = await fetch(`${API_BASE_URL}/api/linkedin-optimizer/analyze-pdf`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.message || "Analysis failed.");

      const data = result?.data as LinkedinOptimizerResult;
      setAnalysis(data);
      setTargetScore(Math.max(0, Math.min(100, Math.round(data.overallScore ?? 0))));
      toast.success("Analysis complete!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not complete analysis.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreStyles = () => {
    if (score >= 80) return { text: "text-emerald-400", stroke: "#10b981", bg: "bg-emerald-500/10" };
    if (score >= 60) return { text: "text-amber-400", stroke: "#f59e0b", bg: "bg-amber-500/10" };
    return { text: "text-rose-400", stroke: "#f43f5e", bg: "bg-rose-500/10" };
  };

  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <section className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 lg:flex-row md:px-8">
        <DashboardSidebar active="linkedin-optimizer" />

        <div className="flex-1 space-y-6">
          <header className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-8 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  LinkedIn Optimizer <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase tracking-widest font-bold">Beta</span>
                </h1>
                <p className="mt-2 text-slate-400 max-w-xl leading-relaxed">
                  Our AI scans your profile to help you appear in more recruiter searches and land more interviews.
                </p>
              </div>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
                <FiArrowLeft /> Back to Dashboard
              </Link>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Section */}
            <div className="lg:col-span-7 space-y-6">
              <article className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6">Upload Profile</h2>
                
                <div className="space-y-6">
                  {/* Dropzone Area */}
                  <div 
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className={`group relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center ${
                      pdfFile ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-800 bg-slate-900/30 hover:border-blue-500/50 hover:bg-blue-500/5"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={onPdfChange} disabled={isSubmitting} />
                    <FiUploadCloud className={`mx-auto text-5xl mb-4 transition-colors ${pdfFile ? "text-emerald-400" : "text-slate-600 group-hover:text-blue-400"}`} />
                    <h3 className="text-lg font-bold text-white">
                      {pdfFile ? pdfFile.name : "Drop LinkedIn PDF here"}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4">Maximum size 5MB • PDF Format only</p>
                    <button className="rounded-full bg-slate-800 px-6 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-all">
                      {pdfFile ? "Change File" : "Select File"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl bg-blue-500/5 border border-blue-500/10 p-4 text-xs text-blue-300">
                    <FiInfo className="flex-shrink-0" />
                    <span><strong>Pro Tip:</strong> To get your PDF, go to your LinkedIn profile → More → Save to PDF.</span>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
                      <FiAlertCircle /> {errorMessage}
                    </div>
                  )}

                  <button
                    disabled={isSubmitting || !pdfFile}
                    onClick={analyzeProfile}
                    className="w-full relative overflow-hidden rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-900/20"
                  >
                    <span className={isSubmitting ? "opacity-0" : "opacity-100"}>Run AI Analysis</span>
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2">
                        <FiLoader className="animate-spin" />
                        <span>Processing Profile...</span>
                      </div>
                    )}
                  </button>
                </div>
              </article>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-5 space-y-6">
              <aside className="rounded-3xl border border-slate-800 bg-[#0f172a]/50 p-6 md:p-8 min-h-[600px] flex flex-col">
                <h2 className="text-xl font-bold text-white mb-6">Analysis Result</h2>
                
                {isSubmitting ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="relative">
                       <div className="w-24 h-24 rounded-full border-t-2 border-blue-500 animate-spin" />
                       <div className="absolute inset-0 flex items-center justify-center text-blue-400 text-2xl">
                          {LOADING_STEPS[loadingStep].icon}
                       </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-white font-medium text-lg">{LOADING_STEPS[loadingStep].label}</p>
                      <div className="flex gap-1 justify-center">
                        {LOADING_STEPS.map((_, i) => (
                          <div key={i} className={`h-1 w-8 rounded-full transition-colors duration-500 ${i <= loadingStep ? "bg-blue-500" : "bg-slate-800"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : !analysis ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center mb-4">
                        <FiCheckCircle className="text-3xl" />
                    </div>
                    <p className="text-slate-400 max-w-[200px]">Upload and run analysis to see your performance score.</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Score Circle */}
                    <div className={`rounded-3xl p-8 flex flex-col items-center border border-white/5 ${getScoreStyles().bg}`}>
                      <div className="relative w-40 h-40">
                        <svg className="w-40 h-40 transform -rotate-90">
                          <circle cx="80" cy="80" r={radius} stroke="#1e293b" strokeWidth="12" fill="transparent" />
                          <circle
                            cx="80" cy="80" r={radius} stroke={getScoreStyles().stroke} strokeWidth="12" fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - (circumference * score) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                          <span className={`text-5xl font-black ${getScoreStyles().text}`}>{score}</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Quality Score</span>
                        </div>
                      </div>
                      <p className={`mt-4 text-sm font-bold uppercase tracking-widest ${getScoreStyles().text}`}>
                        {score >= 80 ? "Optimized" : score >= 60 ? "Average" : "Needs Attention"}
                      </p>
                    </div>

                    {/* Headline Suggestion */}
                    {analysis?.improvedHeadline && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">AI Suggested Headline</h4>
                        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-100 leading-relaxed italic">
                          "{analysis.improvedHeadline}"
                        </div>
                      </div>
                    )}

                    {/* Issues & Improvements List */}
                    <div className="space-y-6">
                       {issues.length > 0 && (
                          <div className="space-y-3">
                             <h4 className="text-xs font-bold uppercase tracking-widest text-rose-500">Detected Issues</h4>
                             <div className="space-y-2">
                                {issues.map((issue, idx) => (
                                  <div key={idx} className="flex gap-3 text-sm p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300">
                                     <FiAlertCircle className="mt-1 text-rose-500 flex-shrink-0" /> {issue}
                                  </div>
                                ))}
                             </div>
                          </div>
                       )}
                       
                       {recommendations.length > 0 && (
                          <div className="space-y-3">
                             <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500">Action Plan</h4>
                             <div className="space-y-2">
                                {recommendations.map((rec, idx) => (
                                  <div key={idx} className="flex gap-3 text-sm p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300">
                                     <FiCheckCircle className="mt-1 text-emerald-500 flex-shrink-0" /> {rec}
                                  </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}