"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { FiPlay, FiCode, FiZap, FiBox, FiCheckCircle, FiInfo } from "react-icons/fi";
import { toast } from "sonner";

interface TestCase {
  input: string;
  expected: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  actual?: string;
  error?: string;
}

interface AnalysisResults {
  testResults: TestResult[];
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: string[];
  analysis: string;
}

interface CodingSandboxProps {
  initialCode?: string;
  language?: string;
  problemStatement?: string;
  testCases?: TestCase[];
  interviewId?: string;
  roundIndex?: number;
  onSuccess?: (analysis: AnalysisResults) => void;
}

const BOILERPLATE: Record<string, string> = {
  javascript: "function solution() {\n  // Your code here\n}",
  python: "def solution():\n    # Your code here\n    pass",
  java: "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
  cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}",
  typescript: "function solution(): void {\n  // Your code here\n}"
};

export default function CodingSandbox({
  initialCode,
  language: initialLanguage = "javascript",
  problemStatement = "Write a function to solve the problem.",
  testCases = [],
  interviewId,
  roundIndex,
  onSuccess
}: CodingSandboxProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || BOILERPLATE[initialLanguage] || "// Write your code here...");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  // Sync state with props when moving to next question
  React.useEffect(() => {
    if (initialCode) setCode(initialCode);
    setResults(null);
  }, [initialCode, problemStatement]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (!initialCode) {
      setCode(BOILERPLATE[newLang] || "// Write your code here...");
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setResults(null);
    try {
      const res = await fetch("/api/coding/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, problemStatement, testCases, interviewId, roundIndex }),
      });
      const result = await res.json();
      if (res.ok) {
        setResults(result.data);
        if (onSuccess) onSuccess(result.data);
        toast.success("Code analyzed successfully!");
      } else {
        toast.error(result.message || "Failed to analyze code.");
      }
    } catch {
      toast.error("Execution error. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl border border-border-medium bg-background/50 overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-medium bg-surface-1/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FiCode size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Coding Sandbox</h3>
              <p className="text-[10px] text-text-muted uppercase tracking-widest">Secure Runtime</p>
            </div>
          </div>
          
          <select 
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-background border border-border-medium rounded-xl px-4 py-2 text-xs font-bold text-slate-300 outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-surface-2 border border-border-medium hover:bg-surface-1 text-foreground text-xs font-bold transition-all disabled:opacity-50"
          >
            {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiPlay size={14} className="text-primary" />}
            {isRunning ? "Running..." : "Run Tests"}
          </button>

          <button
            onClick={() => {
              if (!results) return toast.error("Please run tests before submitting.");
              if (onSuccess) onSuccess(results);
            }}
            disabled={isRunning || !results}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary hover:bg-primary text-foreground text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            <FiCheckCircle size={14} />
            Submit Solution
          </button>
        </div>
      </div>

      {/* Editor & Output Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Problem Description Area */}
        <div className="w-full lg:w-[350px] border-r border-border-medium bg-surface-1/30 overflow-y-auto p-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">
            <FiInfo size={12} className="text-primary" /> Problem Statement
          </div>
          <div className="prose prose-invert prose-sm">
            <p className="text-slate-300 leading-relaxed font-medium">
              {problemStatement}
            </p>
          </div>

          {testCases && testCases.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Example Test Cases
              </div>
              {testCases.map((tc, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-1/50 border border-border-medium/50 space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-text-muted">Input:</span>
                    <span className="text-primary">{tc.input}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono border-t border-border-medium/50 pt-2">
                    <span className="text-text-muted">Expected:</span>
                    <span className="text-emerald-400">{tc.expected}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 min-h-[400px] border-r border-border-medium">
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            }}
          />
        </div>

        {/* Results Panel */}
        <div className="w-full lg:w-[450px] flex flex-col bg-surface-1/50 overflow-y-auto">
          {!results && !isRunning && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
              <FiBox size={48} className="mb-4 text-text-muted" />
              <p className="text-sm text-text-muted">Run your code to see the output and AI complexity analysis.</p>
            </div>
          )}

          {isRunning && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-primary font-medium">AI is simulating test execution...</p>
            </div>
          )}

          {results && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Test Cases Summary */}
              {results.testResults && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                       Test Case Results
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {results.testResults.filter((r) => r.passed).length} / {results.testResults.length} PASSED
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {results.testResults.map((tr, i) => (
                      <div key={i} className="p-3 rounded-xl bg-black/40 border border-border-medium flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-text-muted font-bold truncate">IN: {tr.input}</p>
                          <p className="text-[10px] text-text-secondary truncate">OUT: {tr.actual || "null"}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${tr.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {tr.passed ? "PASS" : "FAIL"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status & Complexity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-surface-1/50 border border-border-medium">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Time</p>
                  <p className="text-sm font-mono text-primary">{results.timeComplexity}</p>
                </div>
                <div className="p-3 rounded-2xl bg-surface-1/50 border border-border-medium">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Space</p>
                  <p className="text-sm font-mono text-emerald-400">{results.spaceComplexity}</p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  <FiZap size={10} className="text-amber-400" /> AI Insights
                </div>
                {results.suggestions?.slice(0, 2).map((s: string, i: number) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-primary/5 border border-blue-500/10 text-[11px] text-blue-200 leading-relaxed">
                    <FiCheckCircle size={14} className="shrink-0 text-primary mt-0.5" />
                    {s}
                  </div>
                ))}
              </div>

              {/* Analysis */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  <FiInfo size={10} /> Logic Audit
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {results.analysis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
