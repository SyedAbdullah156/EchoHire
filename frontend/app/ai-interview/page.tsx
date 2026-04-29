import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { FiMic, FiMonitor, FiPhoneOff, FiSend } from "react-icons/fi";

const questions = [
  "Tell me about yourself and your recent work.",
  "Describe a time you optimized a slow API.",
  "How would you design a scalable chat service?",
  "What trade-offs exist between SQL and NoSQL?",
];

export default function AIInterviewPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1d] text-white">
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-10 pt-8 lg:flex-row md:px-6">
        <DashboardSidebar active="ai-interview" />
        <div className="grid flex-1 gap-5 md:grid-cols-[1.5fr_1fr]">
          <article className="rounded-2xl border border-[#26314d] bg-[#10172a] p-5 shadow-[0_0_30px_rgba(12,45,120,0.2)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#93a5cc] md:text-base">Live AI Session</p>
                <h1 className="text-2xl font-semibold text-[#dbe7ff] md:text-3xl">Senior Software Engineer Interview</h1>
              </div>
              <span className="rounded-full bg-[#192742] px-4 py-2 text-xs text-[#90b4ff] md:text-sm">
                Adaptive Mode
              </span>
            </div>

            <div className="mb-5 grid min-h-[330px] place-items-center rounded-xl border border-[#233151] bg-gradient-to-b from-[#131d33] to-[#0e1528]">
              <p className="text-lg text-[#b4c3e6] md:text-2xl">AI Interviewer Video Feed</p>
            </div>

            <div className="rounded-xl border border-[#2a3653] bg-[#0d1528] p-4">
              <p className="mb-2 text-sm text-[#7d91bd] md:text-base">Current Question</p>
              <p className="text-lg text-[#e4ecff] md:text-2xl">How do you handle production incidents under pressure?</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-[#1c2b4b] px-4 py-2 text-sm text-[#d7e5ff] md:text-base"
              >
                <FiMic />
                Mute
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-[#1c2b4b] px-4 py-2 text-sm text-[#d7e5ff] md:text-base"
              >
                <FiMonitor />
                Share Screen
              </button>
              <Link
                href="/dashboard"
                className="ml-auto flex items-center gap-2 rounded-lg bg-[#7b1f2e] px-4 py-2 text-sm text-[#ffe4e7] md:text-base"
              >
                <FiPhoneOff />
                End Session
              </Link>
            </div>
          </article>

          <aside className="space-y-5 rounded-2xl border border-[#273352] bg-[#10172a] p-5 shadow-[0_0_30px_rgba(12,45,120,0.16)]">
            <div>
              <h2 className="text-2xl font-semibold text-[#dbe7ff] md:text-3xl">Question Queue</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#acbde0] md:text-base">
                {questions.map((question) => (
                  <li key={question} className="rounded-lg bg-[#131e37] px-3 py-2">
                    {question}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#2a3653] bg-[#0d1528] p-4">
              <p className="mb-2 text-sm text-[#7d91bd] md:text-base">Fallback Text Chat</p>
              <textarea
                className="h-28 w-full resize-none rounded-lg border border-[#314162] bg-[#0f1830] p-3 text-sm text-[#e3ebff] outline-none md:text-base"
                placeholder="Type your response here..."
              />
              <button
                type="button"
                className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm md:text-base"
              >
                <FiSend />
                Send Response
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
