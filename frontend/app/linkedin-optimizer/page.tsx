"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { FiCheckCircle, FiLink2, FiUploadCloud } from "react-icons/fi";
import { toast } from "sonner";

type LinkedinOptimizerResult = {
  overallScore: number;
  issues: string[];
  suggestedImprovements: string[];
  improvedHeadline: string;
};

export default function LinkedinOptimizerPage() {
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<LinkedinOptimizerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE_URL = "http://127.0.0.1:5050";

  // 🔥 Count-up animation
  useEffect(() => {
    const startValue = 0;
    let current = startValue;
    setScore(startValue);

    const interval = setInterval(() => {
      current += 1;
      if (current >= targetScore) {
        current = targetScore;
        clearInterval(interval);
      }
      setScore(current);
    }, 15);
    return () => clearInterval(interval);
  }, [targetScore]);

  const recommendations = useMemo(() => {
    if (!analysis) return [];
    return analysis.suggestedImprovements?.slice(0, 8) ?? [];
  }, [analysis]);

  const issues = useMemo(() => {
    if (!analysis) return [];
    return analysis.issues?.slice(0, 10) ?? [];
  }, [analysis]);

  const choosePdf = () => {
    setErrorMessage("");
    fileInputRef.current?.click();
  };

  const onPdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setPdfFile(file);
    setLinkedInUrl("");
    toast.success("PDF selected.");
  };

  const analyzeProfile = async () => {
    setErrorMessage("");
    setAnalysis(null);

    if (!pdfFile) {
      const message = "Please upload a LinkedIn PDF export first.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const endpoint = `${API_BASE_URL}/api/linkedin-optimizer/analyze-pdf`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const serverMessage = typeof result?.message === "string" ? result.message : "";
        const message = serverMessage
          ? `${serverMessage} (HTTP ${response.status})`
          : `Failed to analyze profile. (HTTP ${response.status})`;
        throw new Error(message);
      }

      const data = (result?.data ?? null) as LinkedinOptimizerResult | null;
      if (!data) {
        throw new Error("Backend did not return analysis data.");
      }

      setAnalysis(data);
      setTargetScore(Math.max(0, Math.min(100, Math.round(data.overallScore ?? 0))));
      toast.success("Analysis complete.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.includes("Failed to fetch")
            ? `Cannot reach backend at ${API_BASE_URL}. Is backend running on port 5050?`
            : `${error.message} (API: ${API_BASE_URL})`
          : "Failed to analyze profile.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColor = () => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getStroke = () => {
    if (score >= 80) return "#4ade80";
    if (score >= 60) return "#facc15";
    return "#f87171";
  };

  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-10 pt-8 lg:flex-row md:px-6">
        <DashboardSidebar active="linkedin-optimizer" />
        <div className="flex-1">
        {/* Header */}
        <header className="mb-5 rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.2)]">
          <h1 className="text-2xl font-semibold text-[#dbe7ff] md:text-4xl">
            LinkedIn Profile Optimizer
          </h1>
          <p className="mt-1 text-sm text-[#9fb1d8] md:text-base">
            Share your LinkedIn URL or upload profile PDF. EchoHire will suggest what to improve.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
          {/* LEFT SIDE */}
          <article className="rounded-2xl border border-[#243253] bg-[#0d162a] p-6 shadow-[0_0_30px_rgba(10,39,105,0.2)]">
            <p className="text-xl font-semibold text-[#dbe7ff] md:text-2xl">
              Input Your Profile
            </p>
            <p className="mt-1 text-sm text-[#9fb1d8]">
              Choose one method below to start analysis.
            </p>

            <div className="mt-4 space-y-4 rounded-xl border border-[#2a3b61] bg-[#0a1223] p-5">
              <div>
                <label className="mb-2 block text-sm text-[#9fb1d8]">
                  LinkedIn Profile URL
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-[#31456d] bg-[#0f1a31] px-3 py-2">
                  <FiLink2 className="text-[#8ab2ff]" />
                  <input
                    placeholder="https://www.linkedin.com/in/username"
                    value={linkedInUrl}
                    onChange={(event) => {
                      setLinkedInUrl(event.target.value);
                      setPdfFile(null);
                      setErrorMessage("");
                    }}
                    className="w-full bg-transparent text-sm text-[#e7eeff] outline-none placeholder:text-[#6f86b2]"
                  />
                </div>
                <p className="mt-2 text-xs text-[#7f96c2]">
                  PDF upload is supported now. URL analysis can be added next.
                </p>
              </div>

              <div className="text-center text-xs text-[#7f96c2]">OR</div>

              <div className="rounded-xl border-2 border-dashed border-[#37507f] bg-[#0f1a31] p-5 text-center hover:border-[#5b7fff] transition">
                <FiUploadCloud className="mx-auto text-3xl text-[#8ab2ff]" />
                <p className="mt-2 text-sm text-[#dbe7ff]">
                  Upload LinkedIn PDF export
                </p>
                <p className="text-xs text-[#8ea4cd]">PDF format only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={onPdfChange}
                />
                <button
                  type="button"
                  onClick={choosePdf}
                  className="mt-3 rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium hover:opacity-90"
                >
                  Choose PDF
                </button>
                {pdfFile && (
                  <p className="mt-2 text-xs text-[#9fb1d8]">
                    Selected: <span className="text-[#dbe7ff]">{pdfFile.name}</span>
                  </p>
                )}
              </div>

              {errorMessage && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errorMessage}
                </p>
              )}

              <button
                type="button"
                disabled={isSubmitting || !pdfFile}
                onClick={analyzeProfile}
                className="w-full rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Analyzing..." : "Analyze My Profile"}
              </button>
            </div>
          </article>

          {/* RIGHT SIDE */}
          <aside className="space-y-4 rounded-2xl border border-[#243253] bg-[#0d162a] p-6 shadow-[0_0_30px_rgba(10,39,105,0.2)]">
            {/* 🔥 Premium Score */}
            <div className="rounded-xl border border-[#2a3b61] bg-[#0a1223] p-6 flex flex-col items-center">
              <p className="text-sm text-[#8fa5d3] mb-4">
                Profile Quality Score
              </p>

              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="#1f2a44"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke={getStroke()}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - (circumference * score) / 100
                    }
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getColor()}`}>
                    {score}
                  </span>
                  <span className="text-xs text-[#8ea4cd]">/100</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-[#8ea4cd]">
                {score >= 80
                  ? "Strong Profile 💪"
                  : score >= 60
                  ? "Good, needs polish ✨"
                  : "Needs improvement ⚠️"}
              </p>
            </div>

            {/* Result */}
            {analysis?.improvedHeadline && (
              <div className="rounded-xl border border-[#2a3b61] bg-[#0a1223] p-4">
                <p className="text-lg font-semibold text-[#dbe7ff] mb-2">Improved Headline</p>
                <p className="text-sm text-[#dbe7ff] leading-6">{analysis.improvedHeadline}</p>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <p className="text-xl font-semibold text-[#dbe7ff] md:text-2xl">
                What to improve
              </p>
              {!analysis && (
                <p className="mt-2 text-sm text-[#9fb1d8]">
                  Upload your LinkedIn PDF and click Analyze to get personalized issues and improvements.
                </p>
              )}

              {analysis && issues.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-[#dbe7ff]">Issues found</p>
                  <ul className="mt-2 space-y-2 text-sm text-[#bdc9e3] md:text-base">
                    {issues.map((issue) => (
                      <li
                        key={issue}
                        className="flex gap-2 rounded-lg border border-[#2a3b61] bg-[#101c35] p-3 hover:border-[#3f5ea8] transition"
                      >
                        <FiCheckCircle className="mt-0.5 text-[#2f7ef4]" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis && recommendations.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#dbe7ff]">Suggested improvements</p>
              <ul className="mt-3 space-y-2 text-sm text-[#bdc9e3] md:text-base">
                {recommendations.map((rec) => (
                  <li
                    key={rec}
                    className="flex gap-2 rounded-lg border border-[#2a3b61] bg-[#101c35] p-3 hover:border-[#3f5ea8] transition"
                  >
                    <FiCheckCircle className="mt-0.5 text-[#2f7ef4]" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
                </div>
              )}
            </div>

            <Link
              href="/dashboard"
              className="inline-block rounded-lg border border-[#32466f] px-4 py-2 text-sm text-[#dbe7ff] hover:bg-[#16213a] transition"
            >
              Back to Dashboard
            </Link>
          </aside>
        </div>
        </div>
      </section>
      
    </main>
  );
}