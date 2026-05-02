"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  FiUploadCloud,
  FiFileText,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
  FiUser,
  FiAward,
  FiMessageSquare,
  FiZap,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  candidateName: string;
  overallScore: number;
  topSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestedInterviewQuestions: string[];
}

// ─── Skeleton Loader ────────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.04] ${className ?? ""}`}
    />
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Row 1: Name + Score */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24 w-full md:w-40" />
      </div>
      {/* Row 2: Skills + Strengths + Weaknesses */}
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonBlock className="h-48" />
        <SkeletonBlock className="h-48" />
        <SkeletonBlock className="h-48" />
      </div>
      {/* Row 3: Questions */}
      <SkeletonBlock className="h-56" />
    </div>
  );
}

// ─── Score Ring ─────────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color =
    score >= 80
      ? "#227dff"
      : score >= 60
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-[#7f92be]">/ 100</span>
      </div>
    </div>
  );
}

// ─── Results Dashboard (Bento Grid) ────────────────────────────────────────────

function ResultsDashboard({ result }: { result: AnalysisResult }) {
  const scoreColor =
    result.overallScore >= 80
      ? "text-[#227dff]"
      : result.overallScore >= 60
      ? "text-amber-400"
      : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Row 1: Candidate Name + Score */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        {/* Name Card */}
        <div className="flex flex-col justify-center gap-1.5 rounded-2xl bg-[#0d162a] border border-white/5 px-6 py-5">
          <div className="flex items-center gap-2 text-[#7f92be]">
            <FiUser className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Candidate</span>
          </div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {result.candidateName}
          </h2>
        </div>

        {/* Score Card */}
        <div className="relative flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#0d162a] border border-white/5 px-8 py-5">
          <div className="flex items-center gap-2 text-[#7f92be] mb-2">
            <FiAward className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">ATS Score</span>
          </div>
          <div className="relative">
            <ScoreRing score={result.overallScore} />
          </div>
          <p className={`mt-1 text-sm font-semibold ${scoreColor}`}>
            {result.overallScore >= 80
              ? "Excellent Match"
              : result.overallScore >= 60
              ? "Good Match"
              : "Needs Work"}
          </p>
        </div>
      </div>

      {/* Row 2: Top Skills + Strengths + Weaknesses */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Top Skills */}
        <div className="rounded-2xl bg-[#070d1a] border border-white/5 px-5 py-5 space-y-4">
          <div className="flex items-center gap-2 text-[#7f92be]">
            <FiZap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Top Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.topSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-[#227dff]/20 bg-[#227dff]/10 px-3 py-1.5 text-sm font-medium text-[#93bcff]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="rounded-2xl bg-[#070d1a] border border-white/5 px-5 py-5 space-y-4">
          <div className="flex items-center gap-2 text-[#7f92be]">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest">Strengths</span>
          </div>
          <ul className="space-y-3">
            {result.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[#bdc9e3]">
                <FiCheckCircle className="mt-0.5 w-4 h-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl bg-[#070d1a] border border-white/5 px-5 py-5 space-y-4">
          <div className="flex items-center gap-2 text-[#7f92be]">
            <FiAlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest">Areas to Improve</span>
          </div>
          <ul className="space-y-3">
            {result.weaknesses.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[#bdc9e3]">
                <FiAlertTriangle className="mt-0.5 w-4 h-4 shrink-0 text-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 3: Interview Questions (full-width) */}
      <div className="rounded-2xl bg-[#0d162a] border border-white/5 px-6 py-6 space-y-4">
        <div className="flex items-center gap-2 text-[#7f92be]">
          <FiMessageSquare className="w-4 h-4 text-[#227dff]" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Suggested Interview Questions
          </span>
        </div>
        <ol className="space-y-3">
          {result.suggestedInterviewQuestions.map((q, i) => (
            <li key={q} className="flex items-start gap-4 text-sm text-[#bdc9e3]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#227dff]/10 text-xs font-bold text-[#227dff]">
                {i + 1}
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type PageState = "idle" | "loading" | "result" | "error";

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pageState, setPageState] = useState<PageState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";

  const handleFile = (incoming: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(incoming.type)) {
      toast.error("Only PDF and DOCX files are supported.");
      return;
    }
    setFile(incoming);
    setPageState("idle");
    setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setPageState("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  const analyzeResume = async () => {
    if (!file) return;
    setPageState("loading");
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("resume", file);

      const res = await fetch(`${API_BASE_URL}/api/resume/scan`, {
        method: "POST",
        body: fd,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Analysis failed. Please try again.");
      }

      setResult(json.data);
      setPageState("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(msg);
      setPageState("error");
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
          {/* Page Header */}
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Resume Scanner & ATS Analyzer
            </h1>
            <p className="text-sm text-[#7f92be] md:text-base">
              Upload your resume. Our AI recruiter will score, analyze, and generate targeted interview questions.
            </p>
          </header>

          {/* Upload Zone + File Info */}
          <div className="rounded-2xl bg-[#0d162a] border border-white/5 p-6 space-y-5">
            {/* Drop Zone */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => !file && inputRef.current?.click()}
              className={`relative grid min-h-[200px] place-items-center rounded-xl border-2 border-dashed transition-colors cursor-pointer select-none ${
                isDragging
                  ? "border-[#227dff] bg-[#227dff]/5"
                  : file
                  ? "border-white/10 bg-white/[0.02] cursor-default"
                  : "border-white/10 bg-[#070d1a] hover:border-[#227dff]/40 hover:bg-[#227dff]/5"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 p-4 text-center"
                  >
                    <FiFileText className="w-10 h-10 text-[#227dff]" />
                    <div>
                      <p className="font-semibold text-white">{file.name}</p>
                      <p className="text-sm text-[#7f92be]">
                        {(file.size / 1024).toFixed(1)} KB · {file.type === "application/pdf" ? "PDF" : "DOCX"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-[#dbe7ff] transition-colors hover:bg-white/10"
                    >
                      <FiX className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3 p-6 text-center"
                  >
                    <FiUploadCloud className={`w-12 h-12 transition-colors ${isDragging ? "text-[#227dff]" : "text-[#5c6f94]"}`} />
                    <div>
                      <p className="text-lg font-semibold text-[#dbe7ff]">
                        {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
                      </p>
                      <p className="mt-1 text-sm text-[#5c6f94]">or click to browse — PDF or DOCX</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {!file && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#dbe7ff] transition-colors hover:bg-white/10"
                >
                  Choose File
                </button>
              )}
              {file && pageState !== "loading" && (
                <button
                  type="button"
                  onClick={analyzeResume}
                  className="min-h-[44px] rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                >
                  Analyze Resume
                </button>
              )}
              {pageState === "result" && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#dbe7ff] transition-colors hover:bg-white/10"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Analyze Another
                </button>
              )}
            </div>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {pageState === "loading" && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#227dff] animate-ping" />
                  <p className="text-sm text-[#7f92be]">
                    Gemini AI is analyzing your resume…
                  </p>
                </div>
                <ResultsSkeleton />
              </motion.div>
            )}

            {pageState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-5"
              >
                <p className="font-semibold text-red-400">Analysis Failed</p>
                <p className="mt-1 text-sm text-red-300/70">{errorMsg}</p>
                <button
                  type="button"
                  onClick={analyzeResume}
                  className="mt-4 min-h-[40px] rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/20"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {pageState === "result" && result && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ResultsDashboard result={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  );
}
