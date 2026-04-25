"use client";

import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const shouldCompleteProfile = searchParams.get("completeProfile") === "1";

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <Navbar />
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-8 pt-24 lg:flex-row">
        <DashboardSidebar active="dashboard" />

        <div className="flex-1 space-y-4 rounded-md">
          {shouldCompleteProfile && (
            <div className="rounded-2xl border border-[#35548b] bg-[#0d1932] p-4 text-[#dbe7ff] shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <p className="text-sm md:text-base">
                Welcome! Please complete your profile so EchoHire can personalize interview and career recommendations.
              </p>
              <Link
                href="/profile"
                className="mt-3 inline-flex rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium text-white"
              >
                Complete Profile
              </Link>
            </div>
          )}

          <header className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.2)]">
            <h1 className="text-2xl font-semibold text-[#dbe7ff] md:text-4xl">
              Welcome Back, Uzair Ahmad
            </h1>
            <p className="text-sm text-[#9fb1d8] md:text-lg">
              Explore your Interviews and keep progressing today
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)]">
              <p className="text-base font-semibold text-[#dbe7ff] md:text-lg">Recent Interview</p>
              <p className="mt-3 text-lg text-[#b8c8e8] md:text-2xl">Google Senior Software Engineer</p>
              <p className="text-sm text-[#8ea2ca] md:text-base">Date: Sep 5th | Time: 2PM</p>
              <Link
                href="/ai-interview"
                className="mt-4 inline-flex rounded-lg bg-[#17243f] px-4 py-2 text-sm text-[#dbe5ff] hover:bg-[#1f2f53] md:text-base"
              >
                Continue Interview
              </Link>
            </div>
            <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)]">
              <p className="text-base font-semibold text-[#dbe7ff] md:text-lg">LinkedIn Visibility</p>
              <p className="mt-2 text-4xl text-[#f4f7ff] md:text-6xl">82 / 100</p>
              <Link
                href="/linkedin-optimizer"
                className="mt-4 inline-flex rounded-lg bg-[#17243f] px-4 py-2 text-sm text-[#dbe5ff] hover:bg-[#1f2f53] md:text-base"
              >
                Optimize Profile
              </Link>
            </div>
            <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)]">
              <p className="text-base font-semibold text-[#dbe7ff] md:text-lg">Resume Score</p>
              <p className="mt-2 text-4xl text-[#f4f7ff] md:text-6xl">92 / 100</p>
              <Link
                href="/resume-analyzer"
                className="mt-4 inline-flex rounded-lg bg-[#17243f] px-4 py-2 text-sm text-[#dbe5ff] hover:bg-[#1f2f53] md:text-base"
              >
                Analyze Resume
              </Link>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)]">
              <p className="text-2xl font-semibold text-[#dbe7ff] md:text-3xl">Interview Progress</p>
              <p className="mb-4 text-sm text-[#9fb1d8] md:text-base">
                Track all ongoing and completed interviews
              </p>
              <svg viewBox="0 0 700 280" className="h-[220px] w-full rounded-lg bg-[#0a1223] md:h-[280px]">
                <polyline
                  fill="none"
                  stroke="#4aa3ff"
                  strokeWidth="5"
                  points="20,110 90,150 160,125 230,140 300,35 370,190 440,70 510,180 580,195 650,115 690,170"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)]">
                <p className="text-2xl font-semibold text-[#dbe7ff] md:text-3xl">Skill Mastery</p>
                <p className="mb-4 text-sm text-[#9fb1d8] md:text-base">Track your progress and skills</p>
                {[
                  ["Coding", "90%"],
                  ["Design", "72%"],
                  ["Behavioral", "58%"],
                  ["Technical", "66%"],
                ].map(([label, width]) => (
                  <div key={label} className="mb-3">
                    <p className="mb-1 text-sm text-[#c0d0ef] md:text-base">{label}</p>
                    <div className="h-3 rounded-full bg-[#1a2a46]">
                      <div className="h-3 rounded-full bg-[#4ea1ff]" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.15)]">
                <p className="mb-3 text-2xl font-semibold text-[#dbe7ff] md:text-3xl">Daily Challenges</p>
                <ul className="space-y-2 text-sm text-[#c0d0ef] md:text-base">
                  <li>
                    <strong>Coding Challenge:</strong> Implement a Hash Map
                  </li>
                  <li>
                    <strong>Resume Improvement:</strong> Add another project section
                  </li>
                  <li>
                    <strong>Coding Challenge:</strong> Implement a URL Shortner
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
