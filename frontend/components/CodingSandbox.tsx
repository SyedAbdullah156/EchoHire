"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { FiPlay, FiCode, FiZap, FiBox, FiCheckCircle, FiInfo } from "react-icons/fi";
import { toast } from "sonner";

interface CodingSandboxProps {
  initialCode?: string;
  language?: string;
  problemStatement?: string;
  onSuccess?: (analysis: any) => void;
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
  onSuccess
}: CodingSandboxProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || BOILERPLATE[initialLanguage] || "// Write your code here...");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

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
        body: JSON.stringify({ code, language, problemStatement }),
      });
      const result = await res.json();
      if (res.ok) {
        setResults(result.data);
        if (onSuccess) onSuccess(result.data);
        toast.success("Code analyzed successfully!");
      } else {
        toast.error(result.message || "Failed to analyze code.");
      }
    } catch (error) {
      toast.error("Execution error. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl border border-slate-800 bg-[#0f172a]/50 overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <FiCode size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Coding Sandbox</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Secure Runtime</p>
            </div>
          </div>
          
          <select 
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#050b18] border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50"
        >
          {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiPlay size={14} />}
          {isRunning ? "Analyzing..." : "Run & Analyze"}
        </button>
      </div>

      {/* Editor & Output Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 min-h-[400px] border-r border-slate-800">
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
        <div className="w-full lg:w-96 flex flex-col bg-[#070d1a]/50 overflow-y-auto">
          {!results && !isRunning && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
              <FiBox size={48} className="mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">Run your code to see the output and AI complexity analysis.</p>
            </div>
          )}

          {isRunning && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-blue-400 font-medium">Gemini is simulating execution...</p>
            </div>
          )}

          {results && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Status & Complexity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-sm font-mono text-blue-400">{results.timeComplexity}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Space</p>
                  <p className="text-sm font-mono text-emerald-400">{results.spaceComplexity}</p>
                </div>
              </div>

              {/* Output */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <FiPlay size={10} /> Output
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                  {results.output || "No output generated."}
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <FiZap size={10} className="text-amber-400" /> AI Suggestions
                </div>
                {results.suggestions?.map((s: string, i: number) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-200 leading-relaxed">
                    <FiCheckCircle size={14} className="shrink-0 text-blue-500 mt-0.5" />
                    {s}
                  </div>
                ))}
              </div>

              {/* Analysis */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <FiInfo size={10} /> Logic Audit
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
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
