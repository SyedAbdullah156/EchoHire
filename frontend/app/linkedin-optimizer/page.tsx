"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { FiCheckCircle, FiLink2, FiUploadCloud } from "react-icons/fi";

const recommendations = [
  "Use a stronger headline with target role + specialty keywords.",
  "Rewrite About section with 2 measurable achievements.",
  "Prioritize top 8 skills that match your target jobs.",
  "Add project bullets using action + impact format.",
];

const sectionScores = [
  { name: "Headline", score: 70 },
  { name: "About", score: 80 },
  { name: "Skills", score: 85 },
  { name: "Projects", score: 60 },
];

export default function LinkedinOptimizerPage() {
  const [score, setScore] = useState(0);
  const targetScore = 82;

  // 🔥 Count-up animation
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= targetScore) {
        start = targetScore;
        clearInterval(interval);
      }
      setScore(start);
    }, 15);
    return () => clearInterval(interval);
  }, []);

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
                    className="w-full bg-transparent text-sm text-[#e7eeff] outline-none placeholder:text-[#6f86b2]"
                  />
                </div>
              </div>

              <div className="text-center text-xs text-[#7f96c2]">OR</div>

              <div className="rounded-xl border-2 border-dashed border-[#37507f] bg-[#0f1a31] p-5 text-center hover:border-[#5b7fff] transition">
                <FiUploadCloud className="mx-auto text-3xl text-[#8ab2ff]" />
                <p className="mt-2 text-sm text-[#dbe7ff]">
                  Upload LinkedIn PDF export
                </p>
                <p className="text-xs text-[#8ea4cd]">PDF format only</p>
                <button className="mt-3 rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium hover:opacity-90">
                  Choose PDF
                </button>
              </div>

              <button className="w-full rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium hover:opacity-90">
                Analyze My Profile
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

            {/* 📊 Section Scores */}
            <div className="rounded-xl border border-[#2a3b61] bg-[#0a1223] p-4">
              <p className="text-lg font-semibold text-[#dbe7ff] mb-3">
                Section Breakdown
              </p>

              <div className="space-y-3">
                {sectionScores.map((sec) => (
                  <div key={sec.name}>
                    <div className="flex justify-between text-xs text-[#9fb1d8] mb-1">
                      <span>{sec.name}</span>
                      <span>{sec.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1c2a4a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2a7df7] to-[#372e8f] transition-all duration-700"
                        style={{ width: `${sec.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <p className="text-xl font-semibold text-[#dbe7ff] md:text-2xl">
                What to improve
              </p>
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