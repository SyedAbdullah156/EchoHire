"use client";

import React, { Suspense, useEffect, useState } from "react";
import CodingSandbox from "@/components/CodingSandbox";
import AccessCodeGate from "@/components/coding/AccessCodeGate";
import { FiArrowLeft, FiCheckCircle, FiChevronRight, FiClock, FiCpu, FiShield, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import PracticeCard from "@/components/coding/PracticeCard";
export default function CodingTestPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<any>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState<{
    active: boolean;
    problem: any;
  }>({ active: false, problem: null });

  const practiceQuestions = [
    {
      title: "Palindrome Checker",
      difficulty: "Easy",
      description: "Write a function to check if a given string is a palindrome, considering alphanumeric characters and ignoring case.",
      problem: "Write a function `isPalindrome(s)` that returns true if `s` is a palindrome.",
      initialCode: "function isPalindrome(s) {\n  // Your code here\n}"
    },
    {
      title: "Two Sum",
      difficulty: "Medium",
      description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
      problem: "Write a function `twoSum(nums, target)`.",
      initialCode: "function twoSum(nums, target) {\n  // Your code here\n}"
    },
    {
      title: "Merge Sorted Lists",
      difficulty: "Medium",
      description: "Merge two sorted linked lists and return it as a new sorted list.",
      problem: "Write a function `mergeTwoLists(l1, l2)`.",
      initialCode: "function mergeTwoLists(l1, l2) {\n  // Your code here\n}"
    },
    {
      title: "Reverse String",
      difficulty: "Easy",
      description: "Write a function that reverses a string. The input string is given as an array of characters.",
      problem: "Write a function `reverseString(s)` that reverses `s` in-place.",
      initialCode: "function reverseString(s) {\n  // Your code here\n}"
    },
    {
      title: "Longest Substring",
      difficulty: "Hard",
      description: "Find the length of the longest substring without repeating characters.",
      problem: "Write a function `lengthOfLongestSubstring(s)`.",
      initialCode: "function lengthOfLongestSubstring(s) {\n  // Your code here\n}"
    }
  ];

  useEffect(() => {
    async function validate() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/coding/validate-token?token=${token}`);
        const result = await res.json();
        if (res.ok) {
          setInterview(result.data);
          // Find first pending coding round
          const firstPending = result.data.rounds.findIndex((r: any) => r.status === "pending" && r.type === "CodingAssessment");
          if (firstPending !== -1) setCurrentRoundIndex(firstPending);
        } else {
          toast.error("Invalid or expired assessment link.");
        }
      } catch (error) {
        toast.error("Failed to validate assessment link.");
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b18] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Practice Mode Layout
  if (practiceMode.active) {
    return (
      <div className="flex flex-col h-screen bg-[#050b18] p-6 lg:p-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 font-black text-white italic">PR</div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                Practice Mode <span className="text-slate-600">/</span> <span className="text-emerald-500">{practiceMode.problem.title}</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                <FiCpu className="text-emerald-500" /> Sandbox: Experimental
              </p>
            </div>
          </div>
          <button
            onClick={() => setPracticeMode({ active: false, problem: null })}
            className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <FiArrowLeft /> Back to Practice Hub
          </button>
        </header>
        <div className="flex-1 min-h-0">
          <CodingSandbox
            language="javascript"
            problemStatement={practiceMode.problem.problem}
            initialCode={practiceMode.problem.initialCode}
          />
        </div>
      </div>
    );
  }

  // No active assessment or practice mode -> Show Landing Page
  if (!token && !accessGranted) {
    return (
      <div className="min-h-screen bg-[#050b18] p-6 lg:p-12 space-y-16">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              Technical <span className="text-blue-500">Assessments</span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              Enter your unique code to begin a scheduled assessment, or sharpen your skills with our curated practice modules.
            </p>
          </div>
          <Link href="/candidate/dashboard" className="w-fit px-8 py-4 rounded-2xl bg-[#0d162a] border border-slate-800 text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center gap-2">
            <FiArrowLeft /> Dashboard
          </Link>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Assessment Entry */}
          <div className="lg:col-span-1">
            <div className="p-10 rounded-[3rem] bg-[#0d162a] border-2 border-blue-500/20 space-y-8 h-full">
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <FiShield size={32} />
                </div>
                <h3 className="text-2xl font-black text-white">Join Assessment</h3>
                <p className="text-sm text-slate-400">Enter the unique code from your interview invitation email.</p>
              </div>

              {/* Reuse the AccessCodeGate logic here or a simplified version */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Interview ID"
                  className="w-full h-16 bg-[#050b18] border border-slate-800 rounded-2xl px-6 text-sm font-bold text-white outline-none focus:border-blue-500"
                  onChange={(e) => setInterview({ _id: e.target.value })}
                />
                <button
                  onClick={() => setAccessGranted(false)} // This would trigger the gate
                  className="w-full h-16 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  Continue <FiArrowRight />
                </button>
              </div>
            </div>
          </div>

          {/* Practice Hub */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">Practice Hub</h3>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{practiceQuestions.length} MODULES AVAILABLE</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {practiceQuestions.map((q, i) => (
                <PracticeCard
                  key={i}
                  title={q.title}
                  difficulty={q.difficulty as any}
                  description={q.description}
                  onPractice={() => setPracticeMode({ active: true, problem: q })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Assessment logic
  if (!accessGranted) {
    return <AccessCodeGate interviewId={interview._id} onSuccess={() => setAccessGranted(true)} />;
  }

  const currentRound = interview.rounds[currentRoundIndex];

  return (
    <div className="flex flex-col h-screen bg-[#050b18] p-6 lg:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-black text-white italic">EH</div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              {interview.job_id?.name} <span className="text-slate-600">/</span> <span className="text-blue-500">Round {currentRoundIndex + 1}</span>
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <FiCpu className="text-blue-500" /> Secure Sandbox Active
              </p>
              <div className="h-1 w-1 rounded-full bg-slate-800" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <FiClock className="text-amber-500" /> Timebound: 45m
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {interview.rounds.map((r: any, i: number) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-all ${i === currentRoundIndex ? "bg-blue-500" : i < currentRoundIndex ? "bg-emerald-500" : "bg-slate-800"
                  }`}
              />
            ))}
          </div>
          <Link href="/candidate/dashboard" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">
            Exit
          </Link>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <Suspense fallback={<div className="h-full w-full bg-slate-900/20 animate-pulse rounded-[3rem]" />}>
          <CodingSandbox
            language="javascript"
            problemStatement={currentRound?.problemStatement || "Solve the coding challenge to progress to the next round."}
            onSuccess={(analysis) => {
              // Here we would call the backend to update round status and unlock next
              toast.success("Round completed! Progress synchronized.");
            }}
          />
        </Suspense>
      </div>

      <footer className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Candidate Verified</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 font-medium">Assessment ID: {interview._id.slice(-8).toUpperCase()}</p>
      </footer>
    </div>
  );
}
